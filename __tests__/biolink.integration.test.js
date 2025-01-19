const request = require('supertest');
const app = require('../app.js'); 

describe('BiolinkLite API Integration Tests', () => {

  // Authorization
  it('should register a new user', async () => {
    const newUser = {
      firstName: 'Elon',
      lastName: 'Musk',
      userName: 'elonmusk',
      password: 'password123',
      conformPassword: 'password123'
    };
    
    const res = await request('https://biolinklite-node-api.onrender.com')
      .post('/user/register')
      .send(newUser)
      .expect(201);

    expect(res.body).toHaveProperty('id');
  });

  it('should login the user', async () => {
    const loginDetails = {
      userName: 'elonmusk',
      password: 'password123'
    };

    const res = await request('https://biolinklite-node-api.onrender.com')
      .post('/user/login')
      .send(loginDetails)
      .expect(200);

    expect(res.body).toHaveProperty('token');
  });

  it('should logout the user', async () => {
    const res = await request('https://biolinklite-node-api.onrender.com')
      .post('/user/logout')
      .expect(204);

    expect(res.body).toEqual({});
  });

  // Profile
  it('should get a single profile', async () => {
    const profileId = 1;

    const res = await request('https://biolinklite-node-api.onrender.com')
      .get(`/profile/${profileId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', profileId);
  });

  it('should get a profile list by user ID', async () => {
    const userId = 1;

    const res = await request('https://biolinklite-node-api.onrender.com')
      .get(`/profile/profile-list/${userId}`)
      .expect(200);

    expect(res.body).toBeInstanceOf(Array);
  });

  it('should create or update a profile', async () => {
    const newProfile = {
      userId: 1,
      name: 'kowser ahmed',
      bio: 'Bio text',
      profilePhoto: 'http://example.com/photo.jpg',
      sub_directory: 'kowser vai',
    };

    const res = await request('https://biolinklite-node-api.onrender.com')
      .post('/profile/create')
      .send(newProfile)
      .expect(201);

    expect(res.body).toHaveProperty('id');
  });

  it('should update the profile theme', async () => {
    const profileId = 1;
    const themeId = 2;

    const res = await request('https://biolinklite-node-api.onrender.com')
      .put(`/profile/edit/${profileId}`)
      .send({ themeId })
      .expect(200);

    expect(res.body).toHaveProperty('themeId', themeId);
  });

  it('should delete the profile', async () => {
    const profileId = 1;

    await request('https://biolinklite-node-api.onrender.com')
      .delete(`/profile/delete/${profileId}`)
      .expect(204);
  });

  // Custom link
  it('should get all custom links by profile ID', async () => {
    const profileId = 1;

    const res = await request('https://biolinklite-node-api.onrender.com')
      .get(`/custom_link/${profileId}`)
      .expect(200);

    expect(res.body).toBeInstanceOf(Array);
  });

  it('should add a new custom link', async () => {
    const newLink = {
      profileId: 1,
      name: 'a2z-web',
      url: 'http://a2zweb.com'
    };

    const res = await request('https://biolinklite-node-api.onrender.com')
      .post('/custom_link/add')
      .send(newLink)
      .expect(201);

    expect(res.body).toHaveProperty('id');
  });

  it('should update a custom link', async () => {
    const linkId = 1;
    const updatedLink = {
      profileId: 1,
      name: 'pekka soft',
      url: 'http://pekkasoft.com'
    };

    const res = await request('https://biolinklite-node-api.onrender.com')
      .put(`/custom_link/edit/${linkId}`)
      .send(updatedLink)
      .expect(200);

    expect(res.body).toHaveProperty('id', linkId);
  });

  it('should delete a custom link', async () => {
    const linkId = 1;

    await request('https://biolinklite-node-api.onrender.com')
      .delete(`/custom_link/remove/${linkId}`)
      .expect(204);
  });

  // Headers
  it('should get all headers by profile ID', async () => {
    const profileId = 1;

    const res = await request('https://biolinklite-node-api.onrender.com')
      .get(`/header/${profileId}`)
      .expect(200);

    expect(res.body).toBeInstanceOf(Array);
  });

  it('should add a new header', async () => {
    const newHeader = {
      profileId: 1,
      title: 'Profile header'
    };

    const res = await request('https://biolinklite-node-api.onrender.com')
      .post('/header/add')
      .send(newHeader)
      .expect(201);

    expect(res.body).toHaveProperty('id');
  });

  it('should update a header', async () => {
    const headerId = 1;
    const updatedHeader = {
      profileId: 1,
      title: 'Updated Header'
    };

    const res = await request('https://biolinklite-node-api.onrender.com')
      .put(`/header/edit/${headerId}`)
      .send(updatedHeader)
      .expect(200);

    expect(res.body).toHaveProperty('id', headerId);
  });

  it('should delete a header', async () => {
    const headerId = 1;

    await request('https://biolinklite-node-api.onrender.com')
      .delete(`/header/delete/${headerId}`)
      .expect(204);
  });

  // Social Media
  it('should get all social media', async () => {
    const res = await request('https://biolinklite-node-api.onrender.com')
      .get('/socialMedia/list')
      .expect(200);

    expect(res.body).toBeInstanceOf(Array);
  });

  it('should get social media of a profile', async () => {
    const profileId = 1;

    const res = await request('https://biolinklite-node-api.onrender.com')
      .get(`/socialMedia/${profileId}`)
      .expect(200);

    expect(res.body).toBeInstanceOf(Array);
  });

  it('should add a new social media', async () => {
    const newSocialMedia = {
      profileId: 1,
      socialMediaId: 1,
      url: 'info@bilolink.com'
    };

    const res = await request('https://biolinklite-node-api.onrender.com')
      .post('/socialMedia/add')
      .send(newSocialMedia)
      .expect(201);

    expect(res.body).toHaveProperty('id');
  });

  it('should update a social media', async () => {
    const socialMediaId = 1;
    const updatedSocialMedia = {
      socialMediaId,
      url: 'info@bilolink.com'
    };

    const res = await request('https://biolinklite-node-api.onrender.com')
      .put(`/socialMedia/edit/${socialMediaId}`)
      .send(updatedSocialMedia)
      .expect(200);

    expect(res.body).toHaveProperty('id', socialMediaId);
  });

  it('should delete a social media', async () => {
    const socialMediaId = 1;

    await request('https://biolinklite-node-api.onrender.com')
      .delete(`/socialMedia/delete/${socialMediaId}`)
      .expect(204);
  });

  // User
  it('should get user info by user ID', async () => {
    const userId = 1;

    const res = await request('https://biolinklite-node-api.onrender.com')
      .get(`/user/${userId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', userId);
  });

  it('should update user info', async () => {
    const userId = 1;
    const updatedUser = {
      firstName: 'kowser',
      lastName: 'vai',
      phone: '1234567890',
      email: 'kowser.vai@example.com',
      city: 'Dhaka',
      state: 'Dhaka',
      postalCode: '1205',
      country: 'Bangladesh'
    };

    const res = await request('https://biolinklite-node-api.onrender.com')
      .put(`/user/update/${userId}`)
      .send(updatedUser)
      .expect(200);

    expect(res.body).toHaveProperty('id', userId);
  });

  it('should update user password', async () => {
    const userId = 1;
    const passwordDetails = {
      currentPassword: 'oldpassword',
    };

    const res = await request('https://biolinklite-node-api.onrender.com')
      .put(`/user/password/${userId}`)
      .send(passwordDetails)
      .expect(200);

    expect(res.body).toHaveProperty('id', userId);
  });
});
