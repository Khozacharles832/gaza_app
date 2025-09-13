import { supabase } from "@/lib/supabase";
import { View, Text, Button } from "react-native";

const ProfileScreen = () => {
    return (
        <View>
            <Text>profile</Text>

            <Button title="Sign Out" 
                onPress={async () => await supabase.auth.signOut()} 
            />
        </View>
    );
};

export default ProfileScreen;