# Generated by Django 5.1.6 on 2025-03-02 05:58

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='HealthRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('weight', models.FloatField()),
                ('height', models.FloatField()),
                ('age', models.IntegerField()),
                ('gender', models.CharField(choices=[('male', 'Male'), ('female', 'Female')], max_length=6)),
                ('bmi', models.FloatField(blank=True, null=True)),
                ('bmr', models.FloatField(blank=True, null=True)),
                ('recorded_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
