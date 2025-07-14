import { StyleSheet, View } from 'react-native'
import SearchUsers from '../../components/SearchUsers'

const Search = () => {
  return (
    <View style={styles.container}>
      <SearchUsers />
    </View>
  )
}
export default Search

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})