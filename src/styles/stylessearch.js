import { StyleSheet } from 'react-native';

export const stylesSearch = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
    height: 50,
  },
  searchIcon: {
    width: 40,
    height: 40,
    marginRight: 7,
    opacity: 0.8
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchButtom: {
    width: 18,
    height: 18,
    marginRight: 5,
    opacity: 0.5
  }
});