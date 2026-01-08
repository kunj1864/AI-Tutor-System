# settings.py (Safe for Presentation)

from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY: Presentation ke liye insecure key chalegi
SECRET_KEY = 'django-insecure-presentation-key-change-later'

# DEBUG = True rakhna taaki error dikhe agar aaye to
DEBUG = False

ALLOWED_HOSTS = ['*'] # Sabko allow kar diya

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Tere Apps
    'api',
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders', # React se connect karne ke liye
    
    # Auth ke liye (Agar use kiya ho)
    'dj_rest_auth',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # Sabse upar rakhna
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

ROOT_URLCONF = 'tutor_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'tutor_project.wsgi.application'

# Database (Tera purana wala hi rahega, ye line mat badalna agar alag ho to)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# --- 🛑 IMPORTANT SETTINGS FOR REACT ---
CORS_ALLOW_ALL_ORIGINS = True  # Sab allow kar diya (No Block)
CORS_ALLOW_CREDENTIALS = True


GOOGLE_GEMINI_API_KEY = "AIzaSyDh179wfzRCWNQiW41MPnf1FKoNuvf0-c0"


# --- AUTH FIX FOR PRESENTATION ---
SITE_ID = 1

# Email bhejne ki koshish mat karna (Console me print kar dena bas)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Email verification zaruri nahi hai (Direct login ho jayega)
ACCOUNT_EMAIL_VERIFICATION = 'none'


# --- 🛑 FINAL SECURITY FIX (SABKO AANE DO) 🛑 ---

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',  # <--- Ye line SABSE zaruri hai
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        # BasicAuth hata diya taaki popup na aaye
    ],
}

# Email Backend Fix (Taaki 500 Error na aaye)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
ACCOUNT_EMAIL_VERIFICATION = 'none'
SITE_ID = 1