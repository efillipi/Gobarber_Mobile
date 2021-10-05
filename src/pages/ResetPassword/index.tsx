import React, { useRef, useCallback } from 'react';
import {
  Alert,
  Image,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TextInput,
} from 'react-native';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import getValidationErrors from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';
import logoImg from '../../assets/logo.png';
import { Container, Title, BackToSignIn, BackToSignInText } from './styles';
import api from '../../services/api';
import { ProfileScreenNavigationProp } from '../../routes/StackParamList';

interface ResetPasswordFormData {
  name: string;
  email: string;
  password: string;
}

const ResetPassword: React.FC<ProfileScreenNavigationProp> = ({
  navigation,
}) => {
  const formRef = useRef<FormHandles>(null);

  const passwordInputRef = useRef<TextInput>(null);
  const new_passwordInputRef = useRef<TextInput>(null);

  const handleResetPassword = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          token: Yup.string().required('Token obrigatório '),
          password: Yup.string().min(
            6,
            'No mínimo 6 dígitos no campo de Nova senha ',
          ),
          password_confirmation: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Confirmação incorreta ')
            .min(6, 'No mínimo 6 dígitos no campo de Confirmação de senha '),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/password/reset', data);

        Alert.alert(
          'Reset realizado com sucesso!',
          'Você já pode fazer login na aplicação.',
        );

        navigation.navigate('SignIn');
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          Alert.alert('Erro no processo', `${err.errors}`);

          return;
        }

        Alert.alert('Erro no processo', `${err.response.data.message}`);
      }
    },
    [navigation],
  );

  return (
    <>
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
              <Title>Resetar senha</Title>
            </View>
            <Form ref={formRef} onSubmit={handleResetPassword}>
              <Input
                autoCapitalize="words"
                name="token"
                icon="lock"
                placeholder="Token enviado ao email"
                returnKeyType="next"
                onSubmitEditing={() => {
                  new_passwordInputRef.current?.focus();
                }}
              />

              <Input
                ref={new_passwordInputRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Nova senha"
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />

              <Input
                ref={passwordInputRef}
                secureTextEntry
                name="password_confirmation"
                icon="lock"
                placeholder="Confirmação da senha"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Alterar senha
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
export default ResetPassword;
