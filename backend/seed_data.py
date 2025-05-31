from app import app, db
from models.user import User
from models.election import Election
from models.office import Office
from models.candidate import Candidate
from datetime import datetime, timedelta, timezone

def seed_database():
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        # Create admin user
        admin = User(
            name='Admin User',
            student_id='ADMIN001',
            email='admin@fuotuoke.edu.ng',
            phone='+234 801 234 5679',
            department='Administration',  # ✅ Added
            level='N/A',                  # ✅ Added
            is_admin=True,
            face_registered=True
        )
        admin.set_password('password123')
        db.session.add(admin)
        
        # Create sample student
        student = User(
            name='John Doe',
            student_id='FUO/2020/001',
            email='john.doe@student.fuotuoke.edu.ng',
            phone='+234 801 234 5678',
            department='Computer Science',  # ✅ Added
            level='400 Level',              # ✅ Added
            is_admin=False,
            face_registered=True
        )
        student.set_password('password123')
        db.session.add(student)
        
        # Create sample election
        election = Election(
            title='Student Union Government Election 2024',
            description='Annual election for SUG executive positions',
            start_date=datetime.now(timezone.utc) - timedelta(hours=1),
            end_date=datetime.now(timezone.utc) + timedelta(hours=23),
            status='active',
            total_voters=2847,
            voted_count=1523
        )
        db.session.add(election)
        db.session.commit()
        
        # Create offices
        president_office = Office(
            title='President',
            description='Chief executive officer of the student union',
            max_votes=1,
            election_id=election.id
        )
        db.session.add(president_office)
        
        vp_office = Office(
            title='Vice President',
            description='Deputy to the president and oversees internal affairs',
            max_votes=1,
            election_id=election.id
        )
        db.session.add(vp_office)
        
        secretary_office = Office(
            title='General Secretary',
            description='Responsible for records and communication',
            max_votes=1,
            election_id=election.id
        )
        db.session.add(secretary_office)
        
        db.session.commit()
        
        # Create candidates for President
        sarah = Candidate(
            name='Sarah Johnson',
            department='Computer Science',
            level='400 Level',
            matric_no='FUO/2021/CS/001',
            manifesto='I promise to bring innovative solutions to student welfare, improve campus infrastructure, and create more opportunities for academic and personal growth. Together, we can build a stronger student community.',
            photo='/placeholder.svg?height=200&width=300',
            office_id=president_office.id,
            votes_count=892
        )
        db.session.add(sarah)
        
        michael = Candidate(
            name='Michael Adebayo',
            department='Engineering',
            level='400 Level',
            matric_no='FUO/2021/ENG/045',
            manifesto='My vision is to enhance student representation, improve communication between students and administration, and establish programs that prepare students for successful careers after graduation.',
            photo='/placeholder.svg?height=200&width=300',
            office_id=president_office.id,
            votes_count=631
        )
        db.session.add(michael)
        
        # Create candidates for Vice President
        grace = Candidate(
            name='Grace Okoro',
            department='Medicine',
            level='300 Level',
            matric_no='FUO/2022/MED/012',
            manifesto='I will focus on student health and wellness programs, academic support systems, and creating an inclusive environment where every student can thrive and reach their full potential.',
            photo='/placeholder.svg?height=200&width=300',
            office_id=vp_office.id,
            votes_count=823
        )
        db.session.add(grace)
        
        david = Candidate(
            name='David Okafor',
            department='Business Administration',
            level='300 Level',
            matric_no='FUO/2022/BUS/089',
            manifesto='My commitment is to improve student services, enhance campus security, and create more recreational facilities that will make our university experience more enjoyable and memorable.',
            photo='/placeholder.svg?height=200&width=300',
            office_id=vp_office.id,
            votes_count=700
        )
        db.session.add(david)
        
        # Create candidates for Secretary
        amina = Candidate(
            name='Amina Ibrahim',
            department='Law',
            level='300 Level',
            matric_no='FUO/2022/LAW/023',
            manifesto='I will ensure transparent communication between the student government and the student body, maintain accurate records, and advocate for student rights and welfare.',
            photo='/placeholder.svg?height=200&width=300',
            office_id=secretary_office.id,
            votes_count=456
        )
        db.session.add(amina)
        
        emmanuel = Candidate(
            name='Emmanuel Obi',
            department='Political Science',
            level='300 Level',
            matric_no='FUO/2022/POL/056',
            manifesto='My goal is to improve information dissemination, create a digital archive of student government activities, and ensure that student voices are heard and documented.',
            photo='/placeholder.svg?height=200&width=300',
            office_id=secretary_office.id,
            votes_count=389
        )
        db.session.add(emmanuel)
        
        db.session.commit()
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_database()
