import React,{useState,useEffect} from 'react';
import {Text, View, ScrollView,FlatList,Image,AsyncStorage,Button} from 'react-native';
import {SCLAlert,SCLAlertButton} from 'react-native-scl-alert';
import Icon from 'react-native-vector-icons/FontAwesome5'
import {styles} from '../pages/estilos/styles'

import api from '../services/api';
// Tela responsável por exibir as aulas em que o usuário é o instrutor
export default function EuProfessor({navigation}){

  const [aulas,setAulas] = useState([]);
  const [aviso,setAviso] = useState(false);

  useEffect(()=> {
    async function loadAulas(){
        const user_id = await AsyncStorage.getItem('user');
        const response = await api.get('./professor',{
            headers:{user_id}
        });

        const {message} = response.data;
        
        if(!message){
            const {aula} = response.data;
            setAulas(aula);
        }else{
            setAviso(true)
        }
    }
    loadAulas();
  }, []);

    return(
        <ScrollView>
            <Text style={styles.subTitle}>Essas são as suas aulas!</Text>
            <FlatList style={{paddingTop:10}} data={aulas} keyExtractor={item => item._id}
                        renderItem={({item}) => (
                <View style={styles.containerListVert}>
                <View style={styles.lineTitle}>
                    <Icon name='quote-left' color={'#f78232'} size={22} style={{padding:3}}/>
                    <Text style={styles.tituloVertical}>{item.titulo}</Text>
                </View>
                <View style={styles.cardVerti}>
                    <Image style={styles.imageVertical} source={{uri:'https://transferentia-backend.herokuapp.com/files/'+item.aulaImagem}}/>
                    <View style={styles.listDescricao}>
                        <Text style={styles.titleDescricao}>Descrição:</Text>
                        <Text numberOfLines={6} style={styles.txtDescricao}>- {item.descricao}</Text>
                    </View>
                </View>
                <Button color={'#f78232'} title={'Visualizar alunos'} onPress={() => navigation.navigate('VerAlunos',{aula_id:item._id,aula_titulo:item.titulo})}/> 
                </View>
            )}
            />
            <SCLAlert 
                onRequestClose={()=>setAviso(false)}
                theme='warning'
                show={aviso}
                title={'Opa!'}
                subtitle={'Você não compartilhou nenhuma instrução, comece agora mesmo!!'}>
                <SCLAlertButton theme='warning' onPress={()=> setAviso(false)}>Vou começar!</SCLAlertButton>
              </SCLAlert>
        </ScrollView>
    )
}