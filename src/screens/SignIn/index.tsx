import React from 'react';
import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper,
} from './styles';
import AppleIcon from '../../assets/apple.svg';
import GoogleIcon from '../../assets/google.svg';
import Logo from '../../assets/logo.svg';
import { RFValue } from 'react-native-responsive-fontsize';
import { SignInSocialButton } from '../../components/SignInSocialButton';
import { useAuth } from '../../hooks/auth';

export function SignIn() {
  const { user } = useAuth();

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <Logo width={RFValue(120)} height={RFValue(68)} />
          <Title>
            Controle suas {'\n'}finanças de forma {'\n'}muito simples
          </Title>
        </TitleWrapper>
        <SignInTitle>
          Faça o seu login com {'\n'}uma das contas abaixo
        </SignInTitle>
      </Header>
      <Footer>
        <FooterWrapper>
          <SignInSocialButton title={'Entrar com o Google'} svg={GoogleIcon} />
          <SignInSocialButton title={'Entrar com Apple'} svg={AppleIcon} />
        </FooterWrapper>
      </Footer>
    </Container>
  );
}
