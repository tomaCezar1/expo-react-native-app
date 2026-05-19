import { Link } from 'expo-router';
import { Text, View } from 'react-native';

const SignUp = () => {
  return (
    <View>
      <Text className="text-xl font-bold text-success">Sign Up</Text>
      <Link href="/(auth)/sign-up"> Sign In</Link>
    </View>
  );
};

export default SignUp;
