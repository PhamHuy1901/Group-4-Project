// controllers/userController.js
let users = []; // mảng tạm (chưa dùng DB)

exports.getUsers = (req, res) => {
  res.json(users);
};

exports.createUser = (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: 'name và email là bắt buộc' });
  }
  const newUser = {
    id: Date.now().toString(), // id tạm
    name,
    email
  };
  users.push(newUser);
  res.status(201).json(newUser);
};
