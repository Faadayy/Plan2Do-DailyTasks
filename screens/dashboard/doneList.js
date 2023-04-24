import React from 'react';
import { View, FlatList, Text, Dimensions, TouchableOpacity, Image, Alert, RefreshControl, } from 'react-native';
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height
// import { MaterialIcons } from 'react-native-vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DoneList = ({ tasks, setModalVisible, setModalData }) => {

    const handleListItem = (item) => {
        setModalVisible(true)
        setModalData(item)
    }



    const renderItem = ({ item }) => (
        <View>
            {item.done && <View style={{
                padding: 5,
                paddingHorizontal: 15,
            }}>
                <TouchableOpacity
                    onPress={() => handleListItem(item)}
                    style={{ flexDirection: 'row', alignItems: 'center', }}
                >
                    {/* {
                item.checked ?
                <Icon style={{ marginBottom: 4, marginRight: 9, }} name="check-box" size={24} color="#D8605B" />
                :
                <Icon style={{ marginBottom: 4, marginRight: 9, }} name="check-box-outline-blank" size={24} color="black" />
            } */}
                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 17, }}>
                        {item.title}
                    </Text>
                </TouchableOpacity>
                <View style={{ width: "100%", borderBottomWidth: 1, borderColor: "rgba(0,0,0,0.2)" }}></View>
            </View >

            }
        </View>
    );

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return (
        <View style={{ paddingTop: 10, alignSelf: 'center', flex: 1 }}>

            <FlatList
                data={tasks}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                style={{
                    flex: 1,
                    width: width * 0.87,
                    // height: height * 0.40
                }}
            />
        </View>
    );
};

export default DoneList;
