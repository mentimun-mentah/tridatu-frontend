import { useEffect } from 'react';
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { parseCookies } from "nookies";

import Header from "components/Header";
import CheckoutHeader from "components/Header/Checkout";
import Footer from "components/Footer";

import AccountLayout from "components/Account/Layout";
import AdminLayout from "components/Admin/Layout";
import * as actions from "store/actions";

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isAccount = router.pathname.startsWith('/account');
  const isAadmin = router.pathname.startsWith('/admin');

  const onTryGetUser = () => dispatch(actions.getUser());
  const { csrf_access_token, csrf_refresh_token } = parseCookies();

  useEffect(() => {
    if(isAadmin){
      document.body.style.paddingTop = '0';
    }
    else{
      document.body.style.paddingTop = '68px';
    }
  }, [isAadmin])

  useEffect(() => {
    if (csrf_access_token && csrf_refresh_token) {
      onTryGetUser();
    }
  }, [parseCookies])

  const layout = isAadmin ? <AdminLayout>{children}</AdminLayout> : (
    <>
      {router.pathname === '/checkout' ? <CheckoutHeader/> : <Header />}
        {isAccount ? <AccountLayout pathname={router.pathname}>{children}</AccountLayout> : <>{children}</>}
      <Footer />
    </>
  )

  return layout;
};

export default Layout;
