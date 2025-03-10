# Generated by Django 5.1.6 on 2025-03-02 12:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('health_monitoring', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='healthrecord',
            name='age',
            field=models.PositiveIntegerField(help_text='Age in years'),
        ),
        migrations.AlterField(
            model_name='healthrecord',
            name='bmi',
            field=models.FloatField(default=0.0),
        ),
        migrations.AlterField(
            model_name='healthrecord',
            name='bmr',
            field=models.FloatField(default=0.0),
        ),
        migrations.AlterField(
            model_name='healthrecord',
            name='height',
            field=models.FloatField(help_text='Height in cm'),
        ),
        migrations.AlterField(
            model_name='healthrecord',
            name='weight',
            field=models.FloatField(help_text='Weight in kg'),
        ),
    ]
