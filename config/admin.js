module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '162ce5141f19c4e0ea4535c529df9786'),
  },
});
