set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input

python manage.py migrate

if [ "$CREATE_SUPERUSER" = "True" ]; then
    echo "✅ Creating superuser from env vars..."
    python manage.py createsuperuser --no-input
else
    echo "🔕 CREATE_SUPERUSER is not enabled. Skipping superuser creation."
fi

# python manage.py shell <<EOF
# from django.contrib.auth import get_user_model
# import os

# User = get_user_model()
# username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
# email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
# password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

# if username and password and email:
#     user, created = User.objects.get_or_create(username=username)
#     user.email = email
#     user.is_superuser = True
#     user.is_staff = True
#     user.set_password(password)
#     user.save()
#     print("✅ Superuser created or updated.")
# else:
#     print("❌ Missing superuser environment variables.")
# EOF