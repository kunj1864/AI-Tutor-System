# api/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.conf import settings
from django.core.mail import send_mail

import numpy as np
from sklearn.linear_model import LogisticRegression
from django.db.models import Avg, Sum

# Models & Serializers
from .models import (
    Lesson, UserLesson, Question, Choice, UserQuizAttempt, 
    UserLevelProgress, LEVEL_CHOICES, Profile, ContactSubmission
)
from .serializers import (
    LessonSerializer, UserLessonSerializer, QuestionSerializer, 
    SubmitQuizSerializer, UserSerializer
)

# AI & Auth Imports
import google.generativeai as genai
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client


# --- 1. Course Views ---

class TrendingCourseViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny] 
    queryset = Lesson.objects.filter(is_trending=True)
    serializer_class = LessonSerializer

class AvailableLessonViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny] 
    queryset = Lesson.objects.all() 
    serializer_class = LessonSerializer

class MyLessonViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserLessonSerializer

    def get_queryset(self):
        return UserLesson.objects.filter(user=self.request.user)


# --- 2. Dashboard & AI Views ---

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_dashboard_progress(request):
    user = request.user
    
    # --- A. Progress Calculation ---
    total_lessons = Lesson.objects.count() or 1
    total_possible_points = total_lessons * 5 
    
    started_lessons_count = UserLesson.objects.filter(user=user).count()
    completed_levels_count = UserLevelProgress.objects.filter(user=user, is_completed=True).count()
    
    total_user_points = started_lessons_count + completed_levels_count
    progress_percentage = (total_user_points / total_possible_points) * 100 if total_possible_points > 0 else 0
    
    if total_user_points == 0:
        progress_text = "Start your learning journey by viewing a course!"
    else:
        progress_text = f"Great! You've explored {started_lessons_count} lessons and mastered {completed_levels_count} quiz levels."

    # --- B.AI Prediction
    
   
    user_progress_data = UserLevelProgress.objects.filter(user=user, score__gt=0)
    
    if user_progress_data.exists():
        avg_score_raw = user_progress_data.aggregate(Avg('score'))['score__avg'] or 0
        user_avg_percentage = (avg_score_raw / 20) * 100 
    else:
        
        if started_lessons_count > 0:
             user_avg_percentage = 30.0 
        else:
             user_avg_percentage = 0.0

    # Train Model 
    X_train = np.array([
        [0, 0], [10, 1], [20, 1],       # Fail cases
        [30, 2], [40, 3], [50, 2],      # Average/Pass start
        [60, 4], [70, 5], [80, 5],      # Good
        [90, 6], [100, 7]               # Excellent
    ])
    y_train = np.array([0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1])

    model = LogisticRegression()
    model.fit(X_train, y_train)

    # Prediction
    user_input = np.array([[user_avg_percentage, started_lessons_count]])
    pass_probability = model.predict_proba(user_input)[0][1] 
    pass_chance = round(pass_probability * 100, 1)

    # Feedback Message
    if user_avg_percentage == 0 and started_lessons_count == 0:
        ai_message = "AI Status: No data yet. Start learning to get a prediction!"
        pass_chance = 0.0
    elif pass_chance >= 80:
        ai_message = f"🌟 Excellent! AI predicts a {pass_chance}% chance of success based on your performance."
    elif pass_chance >= 50:
        ai_message = f"📈 Good Track! AI predicts a {pass_chance}% chance. Keep improving your scores."
    else:
        ai_message = f"⚠️ Needs Focus. AI predicts a {pass_chance}% chance. Review the lessons and retry quizzes."

    return Response({
        'progress_percentage': round(progress_percentage, 1),
        'progress_text': progress_text,
        'ai_prediction': ai_message, 
        'pass_probability': pass_chance
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated]) 
def ask_ai_tutor(request):
    question = request.data.get('question')
    if not question:
        return Response({'error': 'No question provided'}, status=400)

    try:
        if not settings.GOOGLE_GEMINI_API_KEY:
            return Response({'error': 'Gemini API Key is missing.'}, status=500)

        genai.configure(api_key=settings.GOOGLE_GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-2.5-flash') 
        prompt = f"""
                You are a friendly and intelligent AI tutor. A student has asked you a question.
                
                Question: "{question}"
                
                Instructions:
                1. Provide a clear and helpful explanation.
                2. Do NOT answer in just one line. Use 3 to 5 sentences to explain the concept properly.
                3. If possible, give a small example to make it easy to understand.
                4. Keep the tone encouraging.
                """
        response = model.generate_content(prompt)
        return Response({'answer': response.text})

    except Exception as e:
        return Response({'error': f"AI Error: {str(e)}"}, status=500)


# --- 3. SIMPLIFIED QUIZ LOGIC ---

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_quiz_lessons(request):
    lessons = Lesson.objects.all().order_by('category', 'title')
    serializer = LessonSerializer(lessons, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_quiz_levels(request, lesson_id):
    user = request.user
    levels_status = []
    previous_level_completed = True 

    try:
        lesson = Lesson.objects.get(id=lesson_id)
    except Lesson.DoesNotExist:
        return Response({'error': 'Lesson not found'}, status=status.HTTP_404_NOT_FOUND)

    for i, (level_key, level_display) in enumerate(LEVEL_CHOICES):
        progress, created = UserLevelProgress.objects.get_or_create(
            user=user,
            lesson=lesson,
            level=level_key,
            defaults={'is_completed': False, 'score': 0}
        )

        is_unlocked = (i == 0) or previous_level_completed 
        if progress.is_completed:
            previous_level_completed = True
        else:
            previous_level_completed = False

        levels_status.append({
            'level': level_key,
            'display_name': level_display,
            'is_unlocked': is_unlocked,
            'is_completed': progress.is_completed,
            'correct_count': progress.score,
            'required_count': 20
        })
    return Response(levels_status)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_quiz_questions(request, lesson_id, level_key):
    """ 
    SIMPLE LOGIC: Har baar naye 20 questions fetch karo.
    Score ko 0 se reset karo.
    """
    BATCH_SIZE = 20
    try:
        lesson = Lesson.objects.get(id=lesson_id)
        
        progress, created = UserLevelProgress.objects.get_or_create(
            user=request.user,
            lesson=lesson,
            level=level_key
        )
       
        progress.score = 0 
        progress.save()
        
    except Lesson.DoesNotExist:
        return Response({'error': 'Lesson not found'}, status=status.HTTP_404_NOT_FOUND)

    # Randomly 20 questions uthao
    questions = Question.objects.filter(lesson=lesson, level=level_key).order_by('?')[:BATCH_SIZE]
    
    if not questions:
         return Response({'message': 'No questions found for this level.'}, status=status.HTTP_200_OK)

    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_quiz_answer(request, lesson_id):
    """ 
    SIMPLE LOGIC: Sirf check karo sahi hai ya galat.
    Sahi hai toh score +1. Galat hai toh kuch mat karo (bas feedback do).
    """
    user = request.user
    serializer = SubmitQuizSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    question_id = serializer.validated_data['question_id']
    choice_id = serializer.validated_data['choice_id']
    level_key = serializer.validated_data['level']

    try:
        choice = Choice.objects.select_related('question').get(id=choice_id, question__id=question_id)
        question = choice.question
        lesson = question.lesson
        progress = UserLevelProgress.objects.get(user=user, lesson=lesson, level=level_key)
    except (Choice.DoesNotExist, UserLevelProgress.DoesNotExist):
        return Response({'error': 'Invalid data.'}, status=status.HTTP_404_NOT_FOUND)
    
    is_correct = choice.is_correct
    
    # Score Update
    if is_correct:
        progress.score += 1
        progress.save()

    # Response Data
    response_data = {
        'is_correct': is_correct,
        'message': 'Correct answer!' if is_correct else 'Incorrect.',
        'correct_answer_text': '' if is_correct else Choice.objects.get(question=question, is_correct=True).text,
        'explanation': question.explanation,
        'new_score': progress.score,
        'level_completed': False 
    }
    
    return Response(response_data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_quiz_result(request, lesson_id, level_key):
    user = request.user
    total = 20 

    
    try:
        lesson = Lesson.objects.get(id=lesson_id)
        progress, created = UserLevelProgress.objects.get_or_create(
            user=user, 
            lesson=lesson, 
            level=level_key,
            defaults={'score': 0, 'is_completed': False}
        )
        score = progress.score
    except Lesson.DoesNotExist:
        return Response({'error': 'Lesson not found.'}, status=404)
    except Exception as e:
       
        print(f"Result Error: {e}")
        score = 0
        progress = None

    percentage = (score / total) * 100
    
    # Feedback Logic
    if percentage >= 90:
        feedback = "Outstanding! You have mastered this level. Excellent work!"
        status_msg = "Expert"
        color = "#4caf50" # Green
    elif percentage >= 75:
        feedback = "Great job! You have a strong grasp of the concepts."
        status_msg = "Good"
        color = "#2196f3" # Blue
    elif percentage >= 50:
        feedback = "Not bad! You passed, but you need more practice."
        status_msg = "Average"
        color = "#ff9800" # Orange
    else:
        feedback = "Needs Improvement. Please review the study materials and try again."
        status_msg = "Poor"
        color = "#f44336" # Red

    # Pass Check (15/20)
    passed = score >= 15
    if passed and progress:
        progress.is_completed = True
        progress.save()

    return Response({
        'final_score': score,
        'total_questions': total,
        'percentage': round(percentage, 1),
        'passed': passed,
        'feedback': feedback,
        'status_msg': status_msg,
        'status_color': color,
        'level_unlocked': passed,
    })

# --- 4. Helper Views (Start Lesson & Contact) ---

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_lesson(request, lesson_id):
    user = request.user
    lesson = get_object_or_404(Lesson, pk=lesson_id)
    UserLesson.objects.get_or_create(user=user, lesson=lesson, defaults={'status': 'IN_PROGRESS'})
    return Response({'status': 'Lesson started'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny]) 
def contact_form_submit(request):
   
    try:
        ContactSubmission.objects.create(
            name=request.data.get('name'),
            email=request.data.get('email'),
            message=request.data.get('message')
        )
        return Response({'success': 'Message saved successfully!'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=500)


# --- Google Login ---
class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client