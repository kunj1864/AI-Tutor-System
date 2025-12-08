# api/models.py

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver

# Levels choices
LEVEL_CHOICES = [
    ('EASY', 'Easy'),
    ('MEDIUM', 'Medium'),
    ('HARD', 'Hard'),
    ('EXPERT', 'Expert'),
]

class Lesson(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    is_trending = models.BooleanField(default=False)
    category = models.CharField(max_length=100, default='General')
    image_url = models.URLField(max_length=500, null=True, blank=True)
    external_url = models.URLField(max_length=500, null=True, blank=True)
    
   
    video_url = models.URLField(max_length=500, null=True, blank=True)
    pdf_url = models.URLField(max_length=500, null=True, blank=True)
    content = models.TextField(null=True, blank=True)

  
    duration = models.CharField(max_length=50, default="2 hours") 
    what_you_will_learn = models.TextField(default="Basics of the subject\nCore concepts\nPractical examples")
    course_includes = models.TextField(default="Access on mobile\nCertificate of completion")
    curriculum = models.TextField(default="Introduction - 10 mins\nGetting Started - 15 mins")

    def __str__(self):
        return self.title

class UserLesson(models.Model):
    STATUS_CHOICES = [
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='IN_PROGRESS')
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'lesson')

class Question(models.Model):
    lesson = models.ForeignKey(Lesson, related_name='questions', on_delete=models.CASCADE)
    text = models.TextField()
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='EASY')
    explanation = models.TextField(blank=True, null=True) 

    def __str__(self):
        return f"{self.lesson.title} - {self.level}: {self.text[:30]}..."

class Choice(models.Model):
    question = models.ForeignKey(Question, related_name='choices', on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.question.id}: {self.text[:20]}"

class UserQuizAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    question_id = models.IntegerField(null=True)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='EASY')
    is_correct = models.BooleanField(default=False)
    attempted_at = models.DateTimeField(default=timezone.now)

class UserLevelProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='EASY')
    is_completed = models.BooleanField(default=False)
    
    # Simple Score Tracking (No JSONField needed now)
    score = models.IntegerField(default=0) 
    total_attempts = models.IntegerField(default=0)

    class Meta:
        unique_together = ('user', 'lesson', 'level')
        verbose_name_plural = "User Level Progress"

# --- Profile Model ---
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    dob = models.DateField(null=True, blank=True)
    college = models.CharField(max_length=200, null=True, blank=True)
    qualification = models.CharField(max_length=100, null=True, blank=True)
    roll_number = models.CharField(max_length=50, null=True, blank=True)
    year = models.CharField(max_length=50, null=True, blank=True)
    course = models.CharField(max_length=100, null=True, blank=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    try:
        instance.profile.save()
    except Profile.DoesNotExist:
        Profile.objects.create(user=instance)

#Contact Model
class ContactSubmission(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name}"