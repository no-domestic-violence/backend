/* eslint-disable arrow-body-style */
function authRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      res.status(401);
      return res.send('Not allowed');
    }

    next();
  };
}

export default authRole;
