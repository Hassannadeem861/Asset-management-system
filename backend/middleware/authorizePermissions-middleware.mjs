// Yeh middleware user ke role ko check karta hai
//  aur dekhta hai ke us user ke paas required permissions
// hain ya nahi. Agar permissions match karti hain,
// toh user ko action perform karne diya jata hai, warna access deny ho jata hai.


import User from '../modles/auth-module.mjs';

export const authorizePermissions = (requiredPermissions) => {
    return async (req, res, next) => {
        try {

            const user = await User.findById(req?.user?.userId).populate('role');  // User ko uske role ke sath database se fetch karo
            // console.log("req.user: ", req.user);
            console.log("check middleware user: ", user);


            if (!user) {
                return res.status(401).json({ message: 'User not found' });  // Agar user nahi mila, toh error
            }

            // User ke role ki permissions ko userPermissions variable mein rakho
            const userPermissions = user.role.permissions;
            console.log("userPermissions: ", userPermissions);

            // Check karo ke user ke paas sab required permissions hain ya nahi
            const hasPermission = requiredPermissions.every(permission => userPermissions.includes(permission));
            console.log("hasPermission: ", hasPermission);

            if (!hasPermission) {
                return res.status(403).json({ error: 'Access denied: insufficient permissions' });  // Agar required permissions nahi hain, toh deny karo
            }

            next();  // Agar sab kuch theek hai, toh aage badho (next middleware ya controller ko call karo)
        } catch (error) {
            res.status(500).json({ error: 'Authorization check failed' });  // Agar koi error ho jaye, toh error message bhejo
        }
    };
};
