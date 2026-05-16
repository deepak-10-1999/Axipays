import { memo } from 'react'
import { maskCardPreview } from '../../utils/format.js'

const CheckoutForm = ({
  formData,
  errors,
  months,
  years,
  currencies,
  countries,
  onChange,
  onCardNumberChange,
  onCvvChange,
}) => (
  <div className="form-grid">
    <div className="form-field">
      <label htmlFor="cardHolderName">Card Holder Name</label>
      <input
        id="cardHolderName"
        type="text"
        value={formData.cardHolderName}
        onChange={onChange('cardHolderName')}
        autoComplete="cc-name"
        placeholder="Alex Morgan"
      />
      {errors.cardHolderName && <span className="field-error">{errors.cardHolderName}</span>}
    </div>

    <div className="form-field">
      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        type="email"
        value={formData.email}
        onChange={onChange('email')}
        autoComplete="email"
        placeholder="alex@email.com"
      />
      {errors.email && <span className="field-error">{errors.email}</span>}
    </div>

    <div className="form-field">
      <label htmlFor="cardNumber">Card Number</label>
      <input
        id="cardNumber"
        type="password"
        value={formData.cardNumber}
        onChange={onCardNumberChange}
        autoComplete="cc-number"
        inputMode="numeric"
        placeholder="•••• •••• •••• ••••"
      />
      <span className="field-helper">Preview: {maskCardPreview(formData.cardNumber)}</span>
      {errors.cardNumber && <span className="field-error">{errors.cardNumber}</span>}
    </div>

    <div className="form-field form-field--inline">
      <div>
        <label htmlFor="expiryMonth">Expiry Month</label>
        <select
          id="expiryMonth"
          value={formData.expiryMonth}
          onChange={onChange('expiryMonth')}
          autoComplete="cc-exp-month"
        >
          <option value="">Month</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        {errors.expiryMonth && <span className="field-error">{errors.expiryMonth}</span>}
      </div>
      <div>
        <label htmlFor="expiryYear">Expiry Year</label>
        <select
          id="expiryYear"
          value={formData.expiryYear}
          onChange={onChange('expiryYear')}
          autoComplete="cc-exp-year"
        >
          <option value="">Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        {errors.expiryYear && <span className="field-error">{errors.expiryYear}</span>}
      </div>
    </div>

    <div className="form-field">
      <label htmlFor="cvv">Card CVV / CVC</label>
      <input
        id="cvv"
        type="password"
        value={formData.cvv}
        onChange={onCvvChange}
        autoComplete="cc-csc"
        inputMode="numeric"
        placeholder="•••"
      />
      {errors.cvv && <span className="field-error">{errors.cvv}</span>}
    </div>

    <div className="form-field">
      <label htmlFor="amount">Payment Amount</label>
      <input
        id="amount"
        type="number"
        min="1"
        step="0.01"
        value={formData.amount}
        onChange={onChange('amount')}
        inputMode="decimal"
        placeholder="120.00"
      />
      {errors.amount && <span className="field-error">{errors.amount}</span>}
    </div>

    <div className="form-field">
      <label htmlFor="currency">Currency</label>
      <select id="currency" value={formData.currency} onChange={onChange('currency')}>
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
      {errors.currency && <span className="field-error">{errors.currency}</span>}
    </div>

    <div className="form-field">
      <label htmlFor="country">Country</label>
      <select id="country" value={formData.country} onChange={onChange('country')}>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
      {errors.country && <span className="field-error">{errors.country}</span>}
    </div>

    <div className="form-field">
      <label htmlFor="address">Address</label>
      <input
        id="address"
        type="text"
        value={formData.address}
        onChange={onChange('address')}
        autoComplete="street-address"
        placeholder="221B Baker Street"
      />
      {errors.address && <span className="field-error">{errors.address}</span>}
    </div>

    <div className="form-field">
      <label htmlFor="phone">Phone</label>
      <input
        id="phone"
        type="tel"
        value={formData.phone}
        onChange={onChange('phone')}
        autoComplete="tel"
        placeholder="+1 555 000 000"
      />
      {errors.phone && <span className="field-error">{errors.phone}</span>}
    </div>
  </div>
)

export default memo(CheckoutForm)
