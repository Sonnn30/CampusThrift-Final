<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CODRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'product_id' => 'required|exists:products,id',
            'date' => 'required|date|after:today',
            'time' => 'required|date_format:H:i',
            'location' => 'required|string|max:255'
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'product_id.required' => 'Product ID is required.',
            'product_id.exists' => 'The selected product does not exist.',
            'date.required' => 'Date is required.',
            'date.date' => 'Date must be a valid date.',
            'date.after' => 'Date must be after today.',
            'time.required' => 'Time is required.',
            'time.date_format' => 'Time must be in HH:MM format.',
            'location.required' => 'Location is required.',
            'location.string' => 'Location must be a string.',
            'location.max' => 'Location must not exceed 255 characters.'
        ];
    }
}
