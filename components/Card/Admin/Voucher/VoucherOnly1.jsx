import { useState } from "react"
import { useRouter } from 'next/router';
import { Card as CardAnt, Typography, Space, Button, Popconfirm, Collapse } from 'antd';
import { QuestionCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import Link from 'next/link';
import Image from 'next/image';
import Card from "react-bootstrap/Card";

const Paragraph = Typography.Paragraph ;

const AdminCardVoucher = ({ image, idx }) => {
  const [editableStr, setEditableStr] = useState('BCAEL500');

  const router = useRouter()

  return(
    <>
      <div className="card-voucher">
      </div>

      <style jsx>{`
        :global(.card-voucher){
          width: 180px;
          margin: 0px 12px 12px 0px;
          display: flex;
          position: relative;
          flex: 0 0 216px;
          height: 70px;
          margin: 8px;
          filter: drop-shadow(rgba(0, 0, 0, 0.12) 0px 1px 3px);
          box-sizing: border-box;
        }
      `}</style>
    </>
  )
}

export default AdminCardVoucher
