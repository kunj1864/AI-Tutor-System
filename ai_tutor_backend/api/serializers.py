# api/serializers.py 
from .models import Profile
from rest_framework import serializers
from .models import (
    Lesson, UserLesson, Question, Choice, UserQuizAttempt, UserLevelProgress, LEVEL_CHOICES, Profile, ContactSubmission
)
from django.contrib.auth.models import User
from allauth.socialaccount.models import SocialAccount

 
class ProfilePictureField(serializers.Field):
    def get_attribute(self, instance):
        return instance

    def to_representation(self, user):
        try:
          
            social_account = SocialAccount.objects.get(user=user, provider='google')
            
            return social_account.get_avatar_url() 
            
        except SocialAccount.DoesNotExist:
            return None
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        
        fields = ['dob', 'college', 'qualification', 'roll_number', 'year', 'course']

class UserSerializer(serializers.ModelSerializer):
    profile_picture = ProfilePictureField(read_only=True) 
   
    profile = ProfileSerializer(required=False) 

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile_picture', 'profile'] 
    
    def update(self, instance, validated_data):
        
        profile_data = validated_data.pop('profile', {})
        profile, created = Profile.objects.get_or_create(user=instance) 
        
        # User instance update 
        instance.email = validated_data.get('email', instance.email)
        instance.username = validated_data.get('username', instance.username)
        instance.save()
        
        # Profile instance update 
        if profile_data:
            profile.dob = profile_data.get('dob', profile.dob)
            profile.college = profile_data.get('college', profile.college)
            profile.qualification = profile_data.get('qualification', profile.qualification)
            profile.roll_number = profile_data.get('roll_number', profile.roll_number)
            profile.year = profile_data.get('year', profile.year)
            profile.course = profile_data.get('course', profile.course)
            profile.save()
            
        return instance


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'

class UserLessonSerializer(serializers.ModelSerializer):
    lesson = LessonSerializer(read_only=True)
    class Meta:
        model = UserLesson
        fields = '__all__'

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        
        fields = ['id', 'text'] 

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)
    lesson_category = serializers.CharField(source='lesson.category', read_only=True)
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    
    class Meta:
        model = Question
        fields = ['id', 'text', 'choices','explanation', 'level', 'lesson_category', 'lesson_title']

class QuizAnswerSerializer(serializers.Serializer):
    """Single question ka answer submit karne ke liye"""
    question_id = serializers.IntegerField()
    choice_id = serializers.IntegerField()
    

# SubmitQuizSerializer 
class SubmitQuizSerializer(serializers.Serializer):
    level = serializers.ChoiceField(choices=LEVEL_CHOICES)
    question_id = serializers.IntegerField()
    choice_id = serializers.IntegerField()

class DashboardProgressSerializer(serializers.Serializer):
    lessons_completed = serializers.IntegerField()
    quizzes_completed = serializers.IntegerField()
    progress_text = serializers.CharField(max_length=255)

class UserLevelProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserLevelProgress
        fields = ['level', 'is_completed', 'correct_count']




class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ['name', 'email', 'message']