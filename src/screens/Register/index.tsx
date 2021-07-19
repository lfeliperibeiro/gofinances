import React from 'react';
import { Container, Header, Title, Form, Fields } from './style';
import { Input } from '../../components/Form/Input/input';
import { Button } from '../../components/Form/Button';

export function Register() {
  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>
      <Form>
        <Fields>
          <Input placeholder={'Nome'} />
          <Input placeholder={'Preço'} />
        </Fields>
        <Button title={'Enviar'} />
      </Form>
    </Container>
  );
}
