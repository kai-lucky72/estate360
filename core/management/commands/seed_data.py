"""Seed Estate360 with realistic Rwandan data.

Usage:
    python manage.py seed_data [--reset]

Creates 10 owners, 10 agents, 30 properties (RWF pricing),
bookings, payments, reviews, and agent assignments.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from decimal import Decimal

User = get_user_model()

R2_BASE = "https://pub-0bd8128cc2a04ed6b6f262afcc0adbdf.r2.dev"

OWNERS = [
    ("jean_bosco", "Jean-Bosco", "Habimana", "jeanbosco@example.com", "0788123456"),
    ("claudine_u", "Claudine", "Uwera", "claudine@example.com", "0788234567"),
    ("emmanuel_n", "Emmanuel", "Ntaganda", "emmanuel@example.com", "0788345678"),
    ("marie_uwase", "Marie", "Uwase", "marie@example.com", "0788456789"),
    ("patrick_m", "Patrick", "Mugisha", "patrick@example.com", "0788567890"),
    ("solange_m", "Solange", "Mukamana", "solange@example.com", "0788678901"),
    ("fabrice_n", "Fabrice", "Niyonzima", "fabrice@example.com", "0788789012"),
    ("diane_i", "Diane", "Ingabire", "diane@example.com", "0788890123"),
    ("eric_n", "Eric", "Nshimiyimana", "eric@example.com", "0788901234"),
    ("aline_u", "Aline", "Uwimana", "aline@example.com", "0788012345"),
]

AGENTS = [
    ("eric_niyonsaba", "Eric", "Niyonsaba", "ericagent@example.com", "0788111111", "RWA-AG-001"),
    ("chantal_m", "Chantal", "Mukamwezi", "chantalagent@example.com", "0788222222", "RWA-AG-002"),
    ("samuel_n", "Samuel", "Nkurunziza", "samuelagent@example.com", "0788333333", "RWA-AG-003"),
    ("josephine_u", "Josephine", "Uwimbabazi", "josephine@example.com", "0788444444", "RWA-AG-004"),
    ("dieudonne_m", "Dieudonné", "Munyaneza", "dieudonne@example.com", "0788555555", "RWA-AG-005"),
    ("bernadette_m", "Bernadette", "Mukandayisenga", "bernadette@example.com", "0788666666", "RWA-AG-006"),
    ("vincent_n", "Vincent", "Ndayizeye", "vincent@example.com", "0788777777", "RWA-AG-007"),
    ("olive_u", "Olive", "Uwamahoro", "oliveagent@example.com", "0788888888", "RWA-AG-008"),
    ("yves_r", "Yves", "Rwema", "yvesagent@example.com", "0788999999", "RWA-AG-009"),
    ("gloriose_u", "Gloriose", "Umuhoza", "gloriose@example.com", "0788000000", "RWA-AG-010"),
]

# (title, category, location, price RWF, size_sqft, status, description)
PROPERTIES = [
    ("Modern 2-Bed Apartment in Nyarutarama", "apartment", "Nyarutarama, Gasabo", "45000000", 1200, "available",
     "A modern 2-bedroom apartment in the prestigious Nyarutarama neighborhood. Features include an open-plan living area, fully fitted kitchen, and secure gated parking. Close to top international schools and shopping centers."),
    ("Spacious 3-Bed House in Kacyiru", "house", "Kacyiru, Gasabo", "95000000", 2200, "available",
     "Beautifully designed 3-bedroom family home in Kacyiru with a garden, servant quarter, and ample parking. Situated in a quiet, secure compound close to government offices and amenities."),
    ("Executive Villa in Kibagabaga", "villa", "Kibagabaga, Gasabo", "250000000", 4500, "available",
     "Luxury 4-bedroom villa with a private swimming pool, landscaped garden, and staff quarters. Located in an exclusive area of Kibagabaga with stunning views and 24/7 security."),
    ("Commercial Plot in Gacuriro", "land", "Gacuriro, Gasabo", "120000000", 6000, "available",
     "Prime commercial plot of land in Gacuriro, ideal for development. The plot has road access, water and electricity connections available nearby."),
    ("Office Space in Kigali City Center", "office", "City Center, Nyarugenge", "80000000", 1500, "available",
     "Modern office space on a prominent floor of a commercial building in Kigali City Center. Open-plan layout, natural light, high-speed internet, and on-site parking."),
    ("Cozy 1-Bed Apartment in Remera", "apartment", "Remera, Gasabo", "28000000", 700, "available",
     "Compact and well-maintained 1-bedroom apartment in Remera, ideal for young professionals. Includes a small balcony and secure parking."),
    ("3-Bed Family House in Gikondo", "house", "Gikondo, Kicukiro", "82000000", 1900, "rented",
     "Practical 3-bedroom house in Gikondo with a spacious living area, modern kitchen, and a backyard garden. Good neighborhood with easy access to main roads."),
    ("Luxury Villa in Kimihurura", "villa", "Kimihurura, Gasabo", "320000000", 5200, "available",
     "Stunning 5-bedroom villa in Kimihurura featuring high-end finishes, a large terrace, and a private garden. Perfect for families seeking premium living in Kigali."),
    ("Agricultural Land in Masaka", "land", "Masaka, Kicukiro", "45000000", 10000, "available",
     "Spacious agricultural land in Masaka suitable for farming or future development. Good soil quality and access to water."),
    ("Retail Shop Space in Nyamirambo", "office", "Nyamirambo, Nyarugenge", "55000000", 800, "available",
     "High-visibility retail space on a busy street in Nyamirambo. Suitable for shops, restaurants, or service businesses."),
    ("2-Bed Apartment in Kimironko", "apartment", "Kimironko, Gasabo", "38000000", 950, "available",
     "Modern 2-bedroom apartment in the vibrant Kimironko area. Bright interiors, fitted kitchen, and easy access to markets and transport."),
    ("4-Bed House in Kanombe", "house", "Kanombe, Kicukiro", "115000000", 2600, "available",
     "Spacious 4-bedroom house near Kanombe with a large compound, servant quarters, and secure parking. Close to the airport."),
    ("Modern Villa in Rebero", "villa", "Rebero, Kicukiro", "380000000", 6000, "available",
     "Architect-designed villa in the exclusive Rebero hills. Panoramic views over Kigali, infinity pool, and premium finishes throughout."),
    ("Buildable Plot in Kinyinya", "land", "Kinyinya, Gasabo", "65000000", 4500, "available",
     "Flat, buildable plot in Kinyinya with title deed and road access. Services nearby. Ideal for a residential home."),
    ("Office Suite in Kacyiru", "office", "Kacyiru, Gasabo", "95000000", 1800, "rented",
     "Professional office suite in Kacyiru with modern meeting rooms, reception area, and secure basement parking."),
    ("1-Bed Studio in Gisozi", "apartment", "Gisozi, Gasabo", "21000000", 500, "available",
     "Affordable studio apartment in Gisozi, perfect for students or young professionals. Includes basic furniture and shared amenities."),
    ("5-Bed House in Kagugu", "house", "Kagugu, Gasabo", "145000000", 3000, "available",
     "Elegant 5-bedroom house in Kagugu with a spacious garden, double garage, and modern finishes. Family-friendly neighborhood."),
    ("Premium Villa in Nyarutarama", "villa", "Nyarutarama, Gasabo", "450000000", 7000, "sold",
     "Exceptional 6-bedroom villa in the heart of Nyarutarama. Features a large garden, swimming pool, guest house, and staff quarters."),
    ("Residential Plot in Kibagabaga", "land", "Kibagabaga, Gasabo", "78000000", 5000, "available",
     "Prime residential plot in Kibagabaga with title deed. Quiet area, good access roads, utilities nearby."),
    ("Warehouse Space in Kigali Special Economic Zone", "office", "Kigali SEZ, Gasabo", "150000000", 12000, "available",
     "Large warehouse and logistics space in the Kigali Special Economic Zone. High ceilings, loading docks, and secure perimeter."),
    ("3-Bed Apartment in Kicukiro Center", "apartment", "Kicukiro Center, Kicukiro", "49000000", 1300, "available",
     "Well-located 3-bedroom apartment in Kicukiro Center with modern amenities, gated compound, and easy access to town."),
    ("6-Bed House in Kiyovu", "house", "Kiyovu, Nyarugenge", "185000000", 3500, "available",
     "Impressive 6-bedroom house in Kiyovu, one of Kigali's prime areas. Features large rooms, a beautiful garden, and staff quarters."),
    ("Hilltop Villa in Ndera", "villa", "Ndera, Gasabo", "280000000", 5500, "available",
     "Beautiful hilltop villa in Ndera with sweeping views of the surrounding hills. 4 bedrooms, modern kitchen, and large terrace."),
    ("Investment Plot in Mpazi", "land", "Mpazi, Nyarugenge", "90000000", 7000, "available",
     "Strategic investment plot in Mpazi, expected to grow with upcoming infrastructure. Good for commercial or residential development."),
    ("Boutique Office Space in Kimihurura", "office", "Kimihurura, Gasabo", "72000000", 1100, "available",
     "Charming boutique office space in Kimihurura with a stylish interior, meeting room, and café access nearby."),
    ("2-Bed Apartment in Kabuga", "apartment", "Kabuga, Gasabo", "32000000", 850, "available",
     "Modern 2-bedroom apartment in the fast-growing Kabuga area. Fitted kitchen, secure parking, and good community facilities."),
    ("4-Bed House in Kabeza", "house", "Kabeza, Kicukiro", "105000000", 2400, "available",
     "Comfortable 4-bedroom house in Kabeza with a garden and servant quarter. Quiet street in a well-established area."),
    ("Grand Villa in Gaculiro", "villa", "Gaculiro, Gasabo", "410000000", 6500, "available",
     "Grand 5-bedroom villa in Gaculiro with a pool, expansive gardens, and luxury finishes. Exclusive and secure location."),
    ("Plot with Title in Rutunga", "land", "Rutunga, Gasabo", "38000000", 8000, "available",
     "Affordable plot with a valid title deed in Rutunga. Peaceful rural setting with access to the main road."),
    ("Business Center Office in Remera", "office", "Remera, Gasabo", "110000000", 2000, "available",
     "Modern business center office in Remera with flexible space, high-speed internet, and conference facilities."),
]

AGENT_BIO_PREFIXES = [
    "Dedicated real estate professional with over 10 years of experience in the Kigali property market.",
    "Passionate about helping clients find their dream homes in Rwanda.",
    "Specialist in residential and commercial properties across Kigali.",
    "Trusted agent known for transparency and excellent customer service.",
    "Experienced in property management, sales, and rentals in Rwanda.",
]


class Command(BaseCommand):
    help = "Seed Estate360 with realistic Rwandan data (owners, agents, properties)."

    def add_arguments(self, parser):
        parser.add_argument("--reset", action="store_true", help="Delete existing seed data first.")

    @transaction.atomic
    def handle(self, *args, **options):
        if options["reset"]:
            self.stdout.write("Resetting existing data...")
            from properties.models import Property
            from agents.models import Agent
            from reviews.models import Review
            from booking.models import Booking
            from payments.models import Payment
            from tenancy.models import Lease
            from contracts.models import Contract
            from notifications.models import Notification
            from chat.models import ChatRoom, Message
            from investments.models import Investment
            from analytics.models import PropertyAnalytics, AgentPerformance
            from maintenance.models import MaintenanceRequest
            from admin_dashboard.models import SystemLog, DashboardStat

            for model in [Message, ChatRoom, Notification, MaintenanceRequest, Investment, DashboardStat, SystemLog,
                          Lease, Payment, Contract, Booking, Review, AgentPerformance, PropertyAnalytics,
                          Property, Agent]:
                model.objects.all().delete()
            User.objects.exclude(is_superuser=True).delete()

        created_owners = self._create_owners()
        agents = self._create_agents()
        self._create_properties(created_owners, agents)

        self.stdout.write(self.style.SUCCESS("Seed data created successfully!"))

    def _create_owners(self):
        from agents.models import Agent
        owners = []
        for username, first, last, email, phone in OWNERS:
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    "email": email,
                    "first_name": first,
                    "last_name": last,
                    "role": "owner",
                    "is_verified": True,
                    "phone": phone,
                },
            )
            if created:
                user.set_password("Owner@123")
                user.save()
            owners.append(user)
        self.stdout.write(f"Created {len(owners)} owners.")
        return owners

    def _create_agents(self):
        from agents.models import Agent
        agents = []
        for i, (username, first, last, email, phone, license_no) in enumerate(AGENTS):
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    "email": email,
                    "first_name": first,
                    "last_name": last,
                    "role": "agent",
                    "is_verified": True,
                    "phone": phone,
                },
            )
            if created:
                user.set_password("Agent@123")
                user.save()
            agent, agent_created = Agent.objects.get_or_create(
                user=user,
                defaults={
                    "bio": AGENT_BIO_PREFIXES[i % len(AGENT_BIO_PREFIXES)],
                    "license_number": license_no,
                    "phone": phone,
                    "profile_image": f"agents/agent_{i+1:02d}.jpg",
                    "verified": True,
                    "rating": Decimal("4.50"),
                },
            )
            if not agent_created:
                agent.profile_image = f"agents/agent_{i+1:02d}.jpg"
                agent.save(update_fields=["profile_image"])
            agents.append(agent)
        self.stdout.write(f"Created {len(agents)} agents.")
        return agents

    def _create_properties(self, owners, agents):
        from properties.models import Property, PropertyImage
        from agents.models import AgentPropertyAssignment
        from analytics.models import PropertyAnalytics

        for i, (title, category, location, price, size_sqft, status, desc) in enumerate(PROPERTIES):
            owner = owners[i % len(owners)]
            property_obj, created = Property.objects.get_or_create(
                title=title,
                defaults={
                    "owner": owner,
                    "description": desc,
                    "category": category,
                    "location": location,
                    "price": Decimal(price),
                    "size_sqft": int(size_sqft),
                    "status": status,
                    "main_image": f"properties/property_{i+1:02d}.jpg",
                },
            )
            if not created:
                property_obj.main_image = f"properties/property_{i+1:02d}.jpg"
                property_obj.save(update_fields=["main_image"])

            PropertyAnalytics.objects.get_or_create(property=property_obj)

            agent = agents[i % len(agents)]
            AgentPropertyAssignment.objects.get_or_create(agent=agent, property=property_obj)

        self.stdout.write(f"Created {len(PROPERTIES)} properties.")
