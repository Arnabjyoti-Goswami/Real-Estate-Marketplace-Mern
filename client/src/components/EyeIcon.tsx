import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

const EyeIcon = ({ visible, setVisible }) => {
  return (
  <>
    {
    visible ? (
    <EyeOutlined onClick={() => {
      setVisible(false)
    }}/>
    ) : (
    <EyeInvisibleOutlined onClick={() => {
      setVisible(true)
    }}/>
    )
    }
  </>
  );
};

export default EyeIcon;