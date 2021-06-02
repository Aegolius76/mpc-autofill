# Generated by Django 3.1.3 on 2021-02-14 01:26

import datetime

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("cardpicker", "0003_source_date"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="source",
            name="date",
        ),
        migrations.AddField(
            model_name="card",
            name="date",
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
        migrations.AddField(
            model_name="cardback",
            name="date",
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
        migrations.AddField(
            model_name="token",
            name="date",
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
    ]
