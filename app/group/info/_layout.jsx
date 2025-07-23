import { Stack } from "expo-router";

const GroupLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="[groupId]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default GroupLayout;

