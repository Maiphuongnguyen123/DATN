import { useState, useEffect } from "react";
import { Input, List, message } from "antd";

import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService";

const PlacesWithStandaloneSearchBox = ({ latLong }) => {
  const {
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = useGoogle({
    apiKey: 'AIzaSyDvF2YFxTxLRUxDRvtkISAma8qICwwsAIY',
  });

  const [value, setValue] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  // Kiểm tra xem Google Maps API đã tải chưa
  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsGoogleLoaded(true);
    } else {
      const timer = setInterval(() => {
        if (window.google && window.google.maps) {
          setIsGoogleLoaded(true);
          clearInterval(timer);
        }
      }, 500);
      
      return () => clearInterval(timer);
    }
  }, []);

  const handlePlaceSelect = async (place) => {
    try {
      if (!isGoogleLoaded) {
        message.warning('Google Maps API đang tải, vui lòng thử lại sau');
        return;
      }

      setValue(place.description);
      setSelectedPlace(place);

      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ placeId: place.place_id }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
          const location = results[0].geometry.location;
          latLong(location.lat(), location.lng(), place.description);
        } else {
          message.error('Không thể lấy tọa độ địa chỉ');
        }
      });

      getPlacePredictions({ input: "" });
    } catch (error) {
      console.error('Error selecting place:', error);
      message.error('Có lỗi xảy ra khi chọn địa chỉ');
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <Input.Search
        style={{ color: "black" }}
        value={value}
        placeholder="Nhập địa chỉ (ví dụ: 123 Đường ABC, Quận 1, TP.HCM)"
        onChange={(evt) => {
          if (evt.target.value.length > 2) { // Chỉ tìm kiếm khi có ít nhất 3 ký tự
            getPlacePredictions({ input: evt.target.value });
          }
          setValue(evt.target.value);
        }}
        loading={isPlacePredictionsLoading}
        allowClear
      />
      
      {!isPlacePredictionsLoading && placePredictions.length > 0 && (
        <div style={{ marginTop: 8, border: '1px solid #d9d9d9', borderRadius: 4 }}>
          <List
            dataSource={placePredictions}
            renderItem={(item) => (
              <List.Item 
                onClick={() => handlePlaceSelect(item)}
                style={{ 
                  padding: '8px 12px',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                {item.description}
              </List.Item>
            )}
          />
        </div>
      )}

      {isPlacePredictionsLoading && (
        <div style={{ textAlign: 'center', padding: 8 }}>
          Đang tìm kiếm địa chỉ...
        </div>
      )}
    </div>
  );
};

export default PlacesWithStandaloneSearchBox;