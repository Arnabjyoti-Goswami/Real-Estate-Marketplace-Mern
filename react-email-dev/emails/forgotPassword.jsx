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
          <Container className='p-8 rounded-lg shadow-lg
            flex flex-col gap-2 justify-center items-center
          '>
            <Heading className='text-[25px] font-bold pt-2 pb-1
            ml-[200px]'>
              Forgot Password
            </Heading>
            <Hr className='bg-slate-500 h-[2px]
            ml-[30px]' />
            <Container className='flex flex-col gap-2 justify-center items-center'>
              <Text className='pt-2
              text-lg font-medium text-center'>
                Click the link below to reset your password.
              </Text>
              <Button className='
              flex justify-center 
              mx-[190px] px-6 py-4 w-[200px]
              text-center text-[20px] text-white font-semibold
              bg-slate-500 bg-opacity-40 
              rounded-lg shadow-lg shadow-slate-400
              border-2 border-slate-500'
              href={dummyString}>
                Reset Password
              </Button>
              <Text className='text-red-400 font-semibold text-sm text-center'>
                This link will expire in 5 minutes.
              </Text>
              <Text className='mt-[30px]
              text-slate-500 font-medium text-lg text-center'>
                If you did not request a password reset, please ignore this email.
              </Text>
            </Container>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailHTML;