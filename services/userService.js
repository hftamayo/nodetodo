import User from "../models/User.js";
import Todo from "../models/Todo.js";
import jwt from "jsonwebtoken";
import { masterKey } from "../config/envvars.js";
import bcrypt from "bcrypt";
/*
middlewares:
1. la rutina del catch 500, es igual para todos los metodos
2. buscar al User por el Id
3. Saltear el password prviamente validado
*/

/*
bugs identificados en la v1 del controller:
1. msg no se muestra si intento registrar un usuario que ya existe
2. en login sin usuario no existe mando un 404, 
si las creds estan malas es un 400, esto puede ser un agujero de seguridad
3. si me logeo correctamente se imprime la metadata de la cuenta de usuario
4. getMe siempre va a devolver un 200 pues toma en cuenta la sesion activa 
(que sucede en multisesion?)
5. idem para logout, ambos request estan basados en una hash valido
6. cuando el password se actualiza se vuelve a imprimir la metadata del usuario, 
seguidamente debería hacerse un logout
7. para actualizar y eliminar toma en cuenta la sesion activa, pero si por ejemplo,
mando datos que ya existe lo deja pasar, asi mismo, si secuentro el token de la sesion
puedo borrar el usuario

*/

export const signUpUser = async function (requestBody) {
  const { name, email, password, age } = requestBody;
  try {
    let searchUser = await User.findOne({ email });
    if (searchUser) {
      return { type: 400, message: "Email already exists" };
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    searchUser = new User({
      name,
      email,
      password: hashedPassword,
      age,
    });
    await searchUser.save();

    const payload = { searchUser: searchUser._id };

    const token = jwt.sign(payload, masterKey, {
      expiresIn: "360000",
    });
    return { type: 200, message: token };
  } catch (error) {
    console.error("userService, signUpUser: " + error.message);
    return { type: 500, message: "Internal Server Error" };
  }
};

export const loginUser = async function (requestBody) {
  const { email, password } = requestBody;
  try {
    let searchUser = await User.findOne({ email });
    if (!searchUser) {
      return { type: 404, message: "User or Password does not match" };
    }
    const passwordMatch = await bcrypt.compare(password, searchUser.password);
    if (!passwordMatch) {
      //please evaluate if returning 400 instead of 404 won't be a secHole
      return { type: 400, message: "User or Password does not match" };
    }
    const payload = { searchUser: searchUser._id };

    const token = jwt.sign(payload, masterKey, {
      expiresIn: 360000,
    });
    return { type: 200, message: token };
  } catch (error) {
    console.error("userService, loginUser: " + error.message);
    return { type: 500, message: "Internal Server Error" };
  }
};

export const listUserByID = async function (requestUserId) {
  const userId = requestUserId;
  try {
    let searchUser = await User.findById(userId);
    if (!searchUser) {
      return { type: 404, message: "User Not Found" };
    }
    return { type: 200, message: searchUser };
  } catch (error) {
    console.error("userService, listItemByID: " + error.message);
    return { type: 500, message: "Internal Server Error" };
  }
};

export const updateUserByID = async function (requestUserId, requestBody) {
  const userId = requestUserId;
  const { name, email, age } = requestBody;

  try {
    let searchUser = await User.findById(userId);
    if (!searchUser) {
      return { type: 404, message: "User Not Found" };
    }
    let checkIfExists = await User.findOne({ email });
    if (checkIfExists && checkIfExists._id.toString() !== searchUser._id.toString()) {
      return { type: 400, message: "User Not Found" };
    }
    searchUser.name = name;
    searchUser.email = email;
    searchUser.age = age;

    await searchUser.save();

    return { type: 200, message: searchUser };
  } catch (error) {
    console.error("userService, updateUserByID: " + error.message);
    return { type: 500, message: "Internal Server Error" };
  }
};

export const updateUserPassword = async function (requestUserId, requestPword) {
  const userId = requestUserId;
  const { password, newPassword } = requestPword;
  try {
    let searchUser = await User.findById(userId);
    if (!searchUser) {
      return { type: 404, message: "User Not Found" };
    }
    const isMatch = await bcrypt.compare(password, searchUser.password);
    if (!isMatch) {
      return { type: 400, message: "Invalid Credentials entered" };
    }
    const salt = await bcrypt.genSalt(10);
    searchUser.password = await bcrypt.hash(newPassword, salt);
    await searchUser.save();
    return { type: 200, message: searchUser };
  } catch (error) {
    console.error("userService, updateUserPassword: " + error.message);
    return { type: 500, message: "Internal Server Error" };
  }
};

export const deleteUserByID = async function (requestUserId) {
  const userId = requestUserId;
  try {
    const searchUser = await User.findById(userId);
    if (!searchUser) {
      return { type: 404, message: "User not found" };
    }
    const todo = await Todo.find({ user: searchUser });
    if (todo) {
      await Todo.deleteMany({ user: searchUser });
    }
    await searchUser.deleteOne();
    return { type: 200, message: "User deleted successfully" };
  } catch (error) {
    console.error("userService, deleteUserByID: " + error.message);
    return { type: 500, message: "Internal Server Error" };
  }
};
