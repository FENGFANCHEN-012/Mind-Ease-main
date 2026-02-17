import { View, Text, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
//import { logout } from "../store/userSlice";
import { router } from "expo-router";

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  return (
    <View>
      <Text>Profile Page</Text>
      <Text>User: {user.name}</Text>

      <Button
        title="Logout"
        onPress={() => {
          dispatch(logout());
          router.replace("/");
        }}
      />
    </View>
  );
}
