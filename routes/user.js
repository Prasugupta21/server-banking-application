const {Router}=require("express");
const router=Router();
const {Signup,Login,Logout, getUsers,getUser} =require( '../controllers/user');
// router.post('/',userVerification)
router.post("/signup",Signup);
router.post("/login",Login);
router.get('/',async(req,res)=>{
   try {
    return res.send("Home page");
   } catch (error) {
    console.log(error);

   }
   return res.send('Home page');
})

router.get('/users', getUsers);
router.get('/user/:id',getUser);



router.post("/logout",Logout);
module.exports=router;
