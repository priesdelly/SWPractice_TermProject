# SWPractice_TermProject
Online Job Fair 
Group: Alice in wonderland
API Only!

# Stack
- Mongo
- Express.js

# Requirement Online Job Fair Registration

1. The system shall allow a user to register by specifying the name, telephone number, email, and password.
2. After registration, the user becomes a registered user, and the system shall allow the user to log in to use the
   system by specifying the email and password. The system shall allow a registered user to log out.
3. After login, the system shall allow the registered user to book up to 3 interview sessions by specifying the date (
   during May 10th - 13th, 2022) and the preferred companies. The company list is also provided to the user. A company
   information includes the company name, address, website, description, and
   telephone number.
4. The system shall allow the registered user to view his interview session bookings.
5. The system shall allow the registered user to edit his interview session bookings.
6. The system shall allow the registered user to delete his interview session bookings.
7. The system shall allow the admin to view any interview session bookings.
8. The system shall allow the admin to edit any interview session bookings.
9. The system shall allow the admin to delete any interview session bookings.

# Additional Requirement
- The system shall comply with the Personal Data Protection Act (PDPA) to ensure that all personal data is collected, used, and disclosed in accordance with the requirements of the law.
- The system shall automatically generate a unique Google Meet link for each scheduled meeting to enable participants to easily access the virtual meeting.
- The system shall enable users to view the status of their job applications, including whether the application is under review, in progress, or has been rejected or accepted.

# Non-Functional Requirements
- Security:
  - The system shall authenticate users using username password. 
  - The system shall be able to keep user’s transactions confidential. 
- Performance:
  - The system shall respond to a request in 3 seconds. 
- Usability:
  - The system shall be used and test via Postman.

# Constraints
- The system shall be a web API.
- The frontend part of the application is not required.
- The development team shall develop the backend system as REST
  APIs
- The database system can be either MongoDB Atlas or MySQL.