import { Stack } from "expo-router";

const GroupLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="[chatId]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default GroupLayout;

