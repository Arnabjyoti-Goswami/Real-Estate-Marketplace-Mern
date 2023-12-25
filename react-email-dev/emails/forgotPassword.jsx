import * as React from 'react';

import { 
  Html,
  Head,
  Tailwind,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Hr,
} from '@react-email/components';

const dummyString = 'https://www.google.com';

const EmailHTML = () => {
  return (
    <Html lang='en'>
      <Head />
      <Tailwind >
        <Body className='bg-white my-12 mx-auto font-sans'>
          <Container className='p-8 rounded-lg shadow-lg'>
            <Heading className='text-xl pt-2 pb-1 text-center'>
              Forgot Password
            </Heading>
            <Hr className='bg-slate-500 h-[2px]' />
            <Text>
              <Text className='pt-2
              text-lg font-medium text-center'>
                Click the link below to reset your password.
              </Text>
              <Button className='flex justify-center 
              mx-[190px] px-4 py-3
              bg-slate-500 bg-opacity-40 text-white font-bold rounded shadow-lg shadow-slate-400
              border-2 border-slate-500'
              href={dummyString}>
                Reset Password
              </Button>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailHTML;