export function logOut(navigation, currentComponentName) {
  console.log("Calling logout from " + currentComponentName);
  navigation.navigate("LogOut");
  return null;
}
