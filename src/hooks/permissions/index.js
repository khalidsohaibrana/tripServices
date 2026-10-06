import {useState, useEffect} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {COMPANY_INFO} from '../../config/company';

const usePermissions = () => {
  const [hasStoragePermission, setHasStoragePermission] = useState(false);

  const checkStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const sdkVersionRaw = Platform.Version ?? 0;
      const sdkVersion =
        typeof sdkVersionRaw === 'string'
          ? parseInt(sdkVersionRaw, 10)
          : sdkVersionRaw;
      if (sdkVersion >= 33) {
        setHasStoragePermission(true);
        return true;
      }
      const permission =
        sdkVersion >= 30
          ? PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
          : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      const granted = await PermissionsAndroid.check(permission);
      setHasStoragePermission(granted);
      return granted;
    }
    return true; // Assume permission granted for iOS
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const sdkVersionRaw = Platform.Version ?? 0;
        const sdkVersion =
          typeof sdkVersionRaw === 'string'
            ? parseInt(sdkVersionRaw, 10)
            : sdkVersionRaw;
        if (sdkVersion >= 33) {
          setHasStoragePermission(true);
          return true;
        }
        const permission =
          sdkVersion >= 30
            ? PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
            : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
        const granted = await PermissionsAndroid.request(permission, {
          title: 'Storage Permission',
          message: `${COMPANY_INFO.name} needs access to storage to export and share invoices.`,
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        });
        setHasStoragePermission(granted === PermissionsAndroid.RESULTS.GRANTED);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
      }
    }
    return true; // Assume permission granted for iOS
  };

  useEffect(() => {
    checkStoragePermission();
  }, []);

  return {
    hasStoragePermission,
    requestStoragePermission,
    checkStoragePermission,
  };
};

export default usePermissions;
