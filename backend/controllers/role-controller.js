import Role from '../modles/role-modle.js';
import User from '../modles/auth-modle.js';

export const seedRoles = async (req, res) => {
    
    try {

        const roles = [
            { name: 'admin', permissions: ['create_asset', 'view_users', 'update_asset', 'delete_asset'] },  
            // { name: 'user', permissions: ['read'] }
            // { name: 'assetManager', permissions: ['create_asset', 'view_users', 'update_asset', 'assign_asset'] }, 
        ];


        // Har role ke liye check karo ke pehle se mojood hai ya nahi
        for (let role of roles) {
            let existingRole = await Role.findOne({ name: role.name });  // Database mein check karna ke role already exist karta hai ya nahi
            console.log("existingRole: ", existingRole);
            if (!existingRole) {
                await new Role(role).save(); 
            }
        }

       return res.status(200).json({ message: 'Roles seeded successfully', roles }); 
    } catch (error) {
        res.status(500).json({ error: 'Error seeding roles' });  
    }
};

export const assignRole = async (req, res) => {
    try {
        const { userId, roleId } = req.body;

        const user = await User.findById(userId);
        const role = await Role.findById(roleId);
 
        if (!user || !role) {
            return res.status(404).json({ error: 'User or Role not found' });
        }

        user.role = roleId;
        await user.save(); 

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