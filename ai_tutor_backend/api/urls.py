# api/urls.py 

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register(r'trending-courses', views.TrendingCourseViewSet, basename='trending')
router.register(r'available-lessons', views.AvailableLessonViewSet, basename='available')
router.register(r'my-lessons', views.MyLessonViewSet, basename='mylessons')

urlpatterns = [
    
    path('', include(router.urls)),
    
    
    path('dashboard/progress/', views.get_dashboard_progress, name='dashboard-progress'),
    
   
    path('ask-tutor-ai/', views.ask_ai_tutor, name='ask-tutor-ai'),
    
    
    path('quiz/lessons/', views.get_quiz_lessons, name='quiz-lessons'),
   
    path('quiz/levels/<int:lesson_id>/', views.get_quiz_levels, name='quiz-levels'),
    
    path('quiz/questions/<int:lesson_id>/<str:level_key>/', views.get_quiz_questions, name='quiz-questions'),
    
    path('quiz/submit-answer/<int:lesson_id>/', views.submit_quiz_answer, name='submit-quiz-answer'),
    path('quiz/result/<int:lesson_id>/<str:level_key>/', views.get_quiz_result, name='get-quiz-result'),
    path('lessons/start/<int:lesson_id>/', views.start_lesson, name='start-lesson'),
    
]
