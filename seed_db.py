import os
import django
import urllib.request
import tempfile
from django.core.files import File

# Initialize Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'estate.settings')
django.setup()

from accounts.models import User
from agents.models import Agent
from properties.models import Property, PropertyImage

def download_image(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req, timeout=15)
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
        tmp.write(response.read())
        tmp.flush()
        return tmp
    except Exception as e:
        print(f"  WARNING: Failed to download image from {url}: {e}")
        return None

def seed():
    print("=" * 50)
    print("Clearing old dummy data...")
    Agent.objects.filter(user__username__startswith='dummy_').delete()
    User.objects.filter(username__startswith='dummy_').delete()
    Property.objects.all().delete()

    print("\nCreating Agents (User + Agent profile)...")
    agent_data = [
        {
            "username": "dummy_alice",
            "email": "alice@estate360.rw",
            "first_name": "Alice",
            "last_name": "Mugwaneza",
            "phone": "+250 788 123 456",
            "bio": "Alice is a top-performing luxury real estate specialist with over 10 years of experience in Kigali, specifically in Nyarutarama and Kagugu areas.",
            "license": "RW-RE-001234",
            "specialization": "Luxury Residential",
            "img": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80",
        },
        {
            "username": "dummy_bob",
            "email": "bob@estate360.rw",
            "first_name": "Bob",
            "last_name": "Kamanzi",
            "phone": "+250 788 987 654",
            "bio": "Bob has facilitated over 300 commercial and residential transactions in Kigali's CBD. His expertise in investment properties is unparalleled.",
            "license": "RW-RE-007895",
            "specialization": "Commercial & Investment",
            "img": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80",
        },
        {
            "username": "dummy_charlie",
            "email": "charlie@estate360.rw",
            "first_name": "Charlie",
            "last_name": "Habimana",
            "phone": "+250 733 456 789",
            "bio": "Charlie specializes in family homes and suburban properties in Kicukiro and Kanombe. Known for his patient, detail-oriented approach.",
            "license": "RW-RE-043256",
            "specialization": "Suburban Residential",
            "img": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&q=80",
        },
        {
            "username": "dummy_diana",
            "email": "diana@estate360.rw",
            "first_name": "Diana",
            "last_name": "Uwamahoro",
            "phone": "+250 782 111 222",
            "bio": "Diana is Gisenyi's go-to agent for Lake Kivu waterfront and luxury condo properties. She speaks English, French, and Kinyarwanda.",
            "license": "RW-RE-009912",
            "specialization": "Waterfront & Luxury Condo",
            "img": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80",
        },
        {
            "username": "dummy_eric",
            "email": "eric@estate360.rw",
            "first_name": "Eric",
            "last_name": "Ndoli",
            "phone": "+250 722 333 444",
            "bio": "Eric is a Kigali innovation-district specialist who bridges the gap between tech startups and premium commercial real estate.",
            "license": "RW-RE-078231",
            "specialization": "Tech Hub & Commercial",
            "img": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
        },
        {
            "username": "dummy_grace",
            "email": "grace@estate360.rw",
            "first_name": "Grace",
            "last_name": "Uwase",
            "phone": "+250 783 555 666",
            "bio": "Grace covers the Musanze and Volcanoes National Park area. She has sold properties with a focus on vacation and investment lodges.",
            "license": "RW-RE-012345",
            "specialization": "Mountain & Resort Properties",
            "img": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80",
        },
    ]

    created_agents = []
    for ad in agent_data:
        print(f"  Creating agent {ad['first_name']} {ad['last_name']}...")
        # Create user
        user = User.objects.create_user(
            username=ad["username"],
            email=ad["email"],
            password="Password123!",
            first_name=ad["first_name"],
            last_name=ad["last_name"],
            role="agent",
            phone=ad["phone"],
        )
        # Download and save profile image to user
        img_tmp = download_image(ad["img"])
        if img_tmp:
            user.profile_image.save(f"{ad['username']}.jpg", File(img_tmp))
            img_tmp.close()
        user.save()

        # Create the Agent profile record
        agent = Agent.objects.create(
            user=user,
            bio=ad["bio"],
            license_number=ad["license"],
            phone=ad["phone"],
            verified=True,
            rating=round(4.5 + (len(ad['username']) % 5) * 0.1, 2),  # 4.5–4.9
        )
        # Also save the image to the Agent's own profile_image
        img_tmp2 = download_image(ad["img"])
        if img_tmp2:
            agent.profile_image.save(f"agent_{ad['username']}.jpg", File(img_tmp2))
            img_tmp2.close()
        agent.save()

        created_agents.append(agent)
        print(f"    -> Agent profile created (id={agent.id})")

    print(f"\nCreating Properties...")
    prop_data = [
        {
            "title": "Nyarutarama Modern Villa",
            "category": "villa",
            "price": "350000000.00",
            "location": "Nyarutarama, Kigali",
            "desc": "A breathtaking modern villa featuring floor-to-ceiling glass walls, an infinity pool with panoramic city views, and smart home technology throughout. Located in Kigali's most prestigious neighborhood.",
            "img": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85",
            "size": 5200,
        },
        {
            "title": "Kigali CBD Luxury Loft",
            "category": "apartment",
            "price": "185000000.00",
            "location": "Kigali City Center",
            "desc": "Modern loft with high ceilings and premium European finishes in the heart of Kigali. Walking distance to major corporate headquarters and restaurants.",
            "img": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=85",
            "size": 2100,
        },
        {
            "title": "Kicukiro Family Home",
            "category": "house",
            "price": "95000000.00",
            "location": "Kicukiro, Kigali",
            "desc": "Spacious 4-bedroom, 3-bathroom home with a large backyard, newly renovated kitchen, and a 2-car garage. Perfect for a growing family.",
            "img": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=85",
            "size": 2800,
        },
        {
            "title": "Lake Kivu Seaside Condo",
            "category": "apartment",
            "price": "220000000.00",
            "location": "Gisenyi, Rubavu",
            "desc": "Wake up to lake breezes in this pristine waterfront condominium. Features a private balcony with unobstructed Lake Kivu views and direct beach access.",
            "img": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=85",
            "size": 1650,
        },
        {
            "title": "Kigali Heights Office Space",
            "category": "office",
            "price": "450000000.00",
            "location": "Kimihurura, Kigali",
            "desc": "A premium open-concept commercial space in a top tier building. Features high-speed fiber connectivity, collaborative open areas, and private meeting pods.",
            "img": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85",
            "size": 4500,
        },
        {
            "title": "Musanze Mountain Lodge",
            "category": "house",
            "price": "143000000.00",
            "location": "Musanze, Northern Province",
            "desc": "Cozy up by the fireplace in this charming wooden lodge with beautiful views of the Volcanoes. Perfect for a vacation home or Airbnb investment.",
            "img": "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&q=85",
            "size": 1800,
        },
        {
            "title": "Rebero Penthouse Suite",
            "category": "apartment",
            "price": "350000000.00",
            "location": "Rebero, Kigali",
            "desc": "The crown jewel of Rebero hill. This full-floor penthouse offers 360-degree views of Kigali, with a private rooftop terrace.",
            "img": "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=1200&q=85",
            "size": 6100,
        },
        {
            "title": "Kagugu Grand Estate",
            "category": "villa",
            "price": "580000000.00",
            "location": "Kagugu, Kigali",
            "desc": "An extraordinary estate set among beautiful gardens. Features a grand manor house, guest cottage, and a large swimming pool.",
            "img": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=85",
            "size": 7800,
        },
    ]

    for i, pd in enumerate(prop_data):
        print(f"  Creating property: {pd['title']}...")
        owner_user = created_agents[i % len(created_agents)].user
        prop = Property.objects.create(
            title=pd["title"],
            description=pd["desc"],
            category=pd["category"],
            price=pd["price"],
            location=pd["location"],
            owner=owner_user,
            status="available",
            size_sqft=pd.get("size"),
        )

        img_tmp = download_image(pd["img"])
        if img_tmp:
            prop.main_image.save(f"prop_{i}.jpg", File(img_tmp))
            img_tmp.close()
            print(f"    -> Image saved")
        prop.save()

    print("\n" + "=" * 50)
    print(f"Seeding complete!")
    print(f"  - {len(created_agents)} agents created")
    print(f"  - {len(prop_data)} properties created")
    print("=" * 50)

if __name__ == '__main__':
    seed()
