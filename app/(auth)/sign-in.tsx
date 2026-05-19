import { Link } from 'expo-router';
import { Text, View } from 'react-native';

const SignIn = () => {
  return (
    <View>
      <Text className="text-xl font-bold text-success">Sign In</Text>
      <Link href="/(auth)/sign-up">Create Account</Link>
    </View>
  );
};

export default SignIn;
