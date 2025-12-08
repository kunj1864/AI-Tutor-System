# api/admin.py 

from django.contrib import admin
from .models import (
    Lesson, UserLesson, Question, Choice, UserQuizAttempt, 
    UserLevelProgress, Profile, 
    ContactSubmission 
)

# Register your models here.
admin.site.register(Lesson)
admin.site.register(UserLesson)
admin.site.register(Question)
admin.site.register(Choice)
admin.site.register(UserQuizAttempt)
admin.site.register(UserLevelProgress)
admin.site.register(Profile)
admin.site.register(ContactSubmission)