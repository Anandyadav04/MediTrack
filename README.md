
# MediTrack 🩺

MediTrack is a full-featured healthcare management web application built with Django. It aims to simplify access to healthcare services through AI-powered tools and user-friendly interfaces.

## 🚀 Features

- 🔬 AI-Based Skin Disease Detection: Upload an image and get instant predictions using deep learning.
- 📅 Appointment Booking: Schedule appointments with specialist doctors.
- 📊 Health Calculators: Calculate BMI and BMR for health monitoring.
- ⏰ Medication Reminders: Get scheduled email and SMS alerts for medications.
- 🧰 rentals: Access contact info and price for rental equipments.
- 🤝 NGO Directory: Find health-related NGOs and the services they offer.

## 🛠️ Tech Stack

- Frontend: Django Templates (HTML, CSS)
- Backend: Python, Django
- Database: SQLite (dev)
- AI/ML: TensorFlow, Keras, OpenCV
- Task Queue: Celery (for reminders)
- Notifications: Email and SMS integration
- Version Control: Git, GitHub

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Anandyadav/MediTrack.git
   cd MediTrack

2. Set up a virtual environment:

python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate


3. Install dependencies:

pip install -r requirements.txt


4. Run migrations and start the server:

python manage.py migrate
python manage.py runserver



🧠 AI Model Info

The skin disease detection model is trained on labeled dermatological image datasets using convolutional neural networks (CNNs). The model is integrated into Django using TensorFlow and OpenCV.

📬 Contact

For any queries or suggestions, feel free to ask on
Email: ay108679@gmail.com
GitHub: @Anandyadav
LinkedIn: [https://www.linkedin.com/in/anand-yadav-149414356]


