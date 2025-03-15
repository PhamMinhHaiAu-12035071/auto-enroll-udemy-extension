import { types, Instance } from 'mobx-state-tree';

// Model cho Image
const ImageModel = types.model('Image', {
  src: types.string,
  srcset: types.array(types.string),
  width: types.maybe(types.number),
  height: types.maybe(types.number)
});

// Model cho Coupon
export const CouponModel = types.model('Coupon', {
  id: types.identifier,
  title: types.string,
  link: types.string,
  couponCode: types.string,
  checkTime: types.string,
  rating: types.maybeNull(types.number),
  authors: types.array(types.string),
  enrollStudents: types.maybeNull(types.number),
  language: types.maybeNull(types.string),
  topics: types.array(types.string),
  price: types.maybeNull(types.number),
  duration: types.maybeNull(types.number),
  image: types.maybeNull(ImageModel),
  amountRating: types.maybeNull(types.number)
});

// Type cho instance của CouponModel
export interface ICoupon extends Instance<typeof CouponModel> {} 