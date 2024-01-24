import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

interface EyeIconProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const EyeIcon = ({ visible, setVisible }: EyeIconProps) => {
  return (
    <>
      {visible ? (
        <EyeOutlined
          onClick={() => {
            setVisible(false);
          }}
        />
      ) : (
        <EyeInvisibleOutlined
          onClick={() => {
            setVisible(true);
          }}
        />
      )}
    </>
  );
};

export default EyeIcon;
