import Role from '../modles/role-module.js';
import User from '../modles/auth-module.mjs';

// Yeh function roles ko seed karta hai,
// yaani database mein admin, manager,
// aur client roles ko create karta hai agar yeh pehle se mojood nahi hain.
// Har role ke sath specific permissions hoti hain, jaise ke create, read, update, aur delete

// Seed roles with permissions
export const seedRoles = async (req, res) => {
    try {

        const roles = [
            { name: 'admin', permissions: ['create', 'read', 'update', 'delete'] },  // Admin ke sab permissions hain
            { name: 'assetManager', permissions: ['create', 'read', 'update'] },  // assetManager ko delete ke ilawa sab kaam ki permissions hain
            { name: 'user', permissions: ['read'] }  // user sirf read kar sakta hai
        ];

        // console.log("roles: ", roles);


        // Har role ke liye check karo ke pehle se mojood hai ya nahi
        for (let role of roles) {
            let existingRole = await Role.findOne({ name: role.name });  // Database mein check karna ke role already exist karta hai ya nahi
            console.log("existingRole: ", existingRole);
            if (!existingRole) {
                await new Role(role).save();  // Agar role nahi hai, toh naya role database mein save kar do
            }
        }

        res.status(200).json({ message: 'Roles seeded successfully', roles });  // Agar sab kuch sahi ho gaya, toh success message bhejo
    } catch (error) {
        res.status(500).json({ error: 'Error seeding roles' });  // Agar koi error aaya, toh error message bhejo
    }
};

// User ko Role assign karne ka function
export const assignRole = async (req, res) => {
    try {
        const { userId, roleId } = req.body;

        // User aur Role database se dhoondhein
        const user = await User.findById(userId);
        const role = await Role.findById(roleId);
        console.log("user: ", user);
        console.log("role: ", role);


        // Agar User ya Role nahi mila toh error throw karo
        if (!user || !role) {
            return res.status(404).json({ error: 'User or Role not found' });
        }

        // User ko Role assign karo
        user.role = roleId;
        await user.save(); // Save karo updated user ko

        // Success message bhejo
        return res.status(200).json({
            message: 'Role assigned successfully',
            user: {
                id: user._id,
                role: role.name
            }
        });
    } catch (error) {
        console.error('Error assigning role:', error);
        return res.status(500).json({ error: 'Server error while assigning role' });
    }
};