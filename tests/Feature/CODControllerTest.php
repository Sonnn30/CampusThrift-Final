<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CODControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $buyer;
    protected User $seller;
    protected Product $product;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test users
        $this->buyer = User::factory()->create(['role' => 'buyer']);
        $this->seller = User::factory()->create(['role' => 'seller']);

        // Create test product
        $this->product = Product::factory()->create();
    }

    public function test_cod_date_page_requires_authentication(): void
    {
        $response = $this->get(route('CODDate', ['product_id' => $this->product->id]));
        $response->assertRedirect(route('login'));
    }

    public function test_cod_date_page_requires_buyer_role(): void
    {
        $this->actingAs($this->seller);

        $response = $this->get(route('CODDate', ['product_id' => $this->product->id]));
        $response->assertStatus(403);
    }

    public function test_cod_date_page_loads_successfully_for_buyer(): void
    {
        $this->actingAs($this->buyer);

        $response = $this->get(route('CODDate', ['product_id' => $this->product->id]));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('CODDate')
            ->has('product')
        );
    }

    public function test_cod_date_store_validates_required_fields(): void
    {
        $this->actingAs($this->buyer);

        $response = $this->post(route('CODDate.store'), []);
        $response->assertSessionHasErrors(['product_id', 'date']);
    }

    public function test_cod_date_store_validates_date_after_today(): void
    {
        $this->actingAs($this->buyer);

        $response = $this->post(route('CODDate.store'), [
            'product_id' => $this->product->id,
            'date' => now()->subDay()->format('Y-m-d')
        ]);
        $response->assertSessionHasErrors(['date']);
    }

    public function test_cod_date_store_successfully(): void
    {
        $this->actingAs($this->buyer);

        $response = $this->post(route('CODDate.store'), [
            'product_id' => $this->product->id,
            'date' => now()->addDay()->format('Y-m-d')
        ]);

        $response->assertRedirect(route('CODTime'));
        $this->assertTrue(session()->has('cod_date'));
        $this->assertTrue(session()->has('cod_product_id'));
    }

    public function test_cod_time_page_requires_session_data(): void
    {
        $this->actingAs($this->buyer);

        $response = $this->get(route('CODTime'));
        $response->assertRedirect(route('CODDate'));
    }

    public function test_cod_time_page_loads_with_session_data(): void
    {
        $this->actingAs($this->buyer);

        session([
            'cod_date' => now()->addDay()->format('Y-m-d'),
            'cod_product_id' => $this->product->id
        ]);

        $response = $this->get(route('CODTime'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('CODTime')
            ->has('product')
            ->has('selectedDate')
            ->has('availableTimes')
        );
    }

    public function test_cod_location_page_requires_session_data(): void
    {
        $this->actingAs($this->buyer);

        $response = $this->get(route('CODLocation'));
        $response->assertRedirect(route('CODDate'));
    }

    public function test_cod_location_store_creates_appointment(): void
    {
        $this->actingAs($this->buyer);

        session([
            'cod_date' => now()->addDay()->format('Y-m-d'),
            'cod_time' => '10:00',
            'cod_product_id' => $this->product->id
        ]);

        $response = $this->post(route('CODLocation.store'), [
            'location' => 'Campus Main Gate'
        ]);

        $response->assertRedirect(route('BuyerMySchedule'));

        $this->assertDatabaseHas('appointment', [
            'product_id' => $this->product->id,
            'users_id' => $this->buyer->id,
            'status' => 'pending',
            'locations' => 'Campus Main Gate'
        ]);

        $this->assertFalse(session()->has('cod_date'));
        $this->assertFalse(session()->has('cod_time'));
        $this->assertFalse(session()->has('cod_product_id'));
    }

    public function test_appointment_show_loads_successfully(): void
    {
        $this->actingAs($this->buyer);

        $appointment = Appointment::factory()->create([
            'users_id' => $this->buyer->id,
            'product_id' => $this->product->id
        ]);

        $response = $this->get(route('CODAppointment.show', $appointment));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('AppointmentDetail')
            ->has('appointment')
        );
    }

    public function test_appointment_status_update(): void
    {
        $this->actingAs($this->buyer);

        $appointment = Appointment::factory()->create([
            'users_id' => $this->buyer->id,
            'product_id' => $this->product->id
        ]);

        $response = $this->patch(route('CODAppointment.updateStatus', $appointment), [
            'status' => 'confirmed'
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('appointment', [
            'id' => $appointment->id,
            'status' => 'confirmed'
        ]);
    }
}
