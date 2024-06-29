const{ mongoose ,Schema}= require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Your Name is required"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
 balance:{
  type:Number,
  default:0
 },
 accountNumber:{
  type:String,
  unique:true
 },
  profilePicture:{
    type:String,
    default:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }]
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("User", userSchema);