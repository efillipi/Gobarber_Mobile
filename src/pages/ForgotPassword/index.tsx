import React, { useRef, useCallback, useState } from 'react';
import {
  Alert,
  Image,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TextInput,
  ActivityIndicator,
  Modal,
} from 'react-native';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import getValidationErrors from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import logoImg from '../../assets/logo.png';
import {
  Container,
  Title,
  BackToSignIn,
  BackToSignInText,
  SectionContentModal,
} from './styles';
import { ProfileScreenNavigationProp } from '../../routes/StackParamList';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC<ProfileScreenNavigationProp> = ({
  navigation,
}) => {
  const formRef = useRef<FormHandles>(null);

  const emailInputRef = useRef<TextInput>(null);

  const [modalVisibleAppointments, setModalVisibleAppointments] =
    useState(false);

  const handleForgotPassword = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .email('Digite um e-mail válido')
            .required('E-mail obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/password/forgot', data);

        Alert.alert('Recuperação de senha', 'Enviado um token ao seu e-mail', [
          {
            text: 'OK',
            onPress: () => {
              setModalVisibleAppointments(false);
              navigation.navigate('ResetPassword');
            },
          },
        ]);
      } catch (err: any) {
        setModalVisibleAppointments(false);
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          Alert.alert('Erro no envio', `${err.message}`);
          return;
        }

        Alert.alert('Erro no envio', `${err.response.data.message}`);
      }
    },
    [navigation],
  );

  return (
    <>
      <Modal
        animationType="slide"
        transparent
        visible={modalVisibleAppointments}
        onRequestClose={() => {
          setModalVisibleAppointments(!modalVisibleAppointments);
        }}
      >
        <SectionContentModal>
          <Image source={logoImg} />
          <Title>Enviando e-mail ...</Title>
          <ActivityIndicator size="large" color="#999" />
        </SectionContentModal>
      </Modal>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Recuperar senha</Title>
            </View>
            <Form ref={formRef} onSubmit={handleForgotPassword}>
              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                  setModalVisibleAppointments(!modalVisibleAppointments);
                }}
              />

              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                  setModalVisibleAppointments(!modalVisibleAppointments);
                }}
              >
                Recuperar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#ff9000" />
        <BackToSignInText>Voltar para logon</BackToSignInText>
      </BackToSignIn>
    </>
  );
};
export default ForgotPassword;
