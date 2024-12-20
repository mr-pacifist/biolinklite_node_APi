BioLinkLite Node API
BioLinkLite is a Node.js API designed to manage profiles and their associated custom links and social media links. 
This API provides endpoints to create, read, update, and delete profiles, custom links, and social media links.

Installation
To get started, clone the repository and install the necessary dependencies:
git clone https://github.com/mr-pacifist/biolinklite_node_APi.git
npm install

Usage:
Before running the API, make sure to set up the environment variables. 
Create a .env file in the root directory.
Follow the example.env and fill all .env variable correctly.
Connect with PostgreSQL database through database string

Run the API using the following command:
npx prisma migrate dev init 
npm run seed
npm start

