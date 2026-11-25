from functools import partial

from kivy.app import App
from kivy.core.window import Window
from kivy.lang import Builder
from kivy.metrics import dp
from kivy.uix.button import Button
from kivy.uix.screenmanager import Screen, ScreenManager

from clinic_db import ClinicDatabase


KV = """
#:import dp kivy.metrics.dp

<TitleText@Label>:
    color: 0.12, 0.17, 0.26, 1
    bold: True

<SectionCard@BoxLayout>:
    orientation: "vertical"
    padding: dp(14)
    spacing: dp(8)
    size_hint_y: None
    canvas.before:
        Color:
            rgba: 1, 1, 1, 1
        RoundedRectangle:
            pos: self.pos
            size: self.size
            radius: [16]

<PatientListScreen>:
    name: "list"
    BoxLayout:
        orientation: "vertical"
        canvas.before:
            Color:
                rgba: 0.93, 0.96, 1, 1
            Rectangle:
                pos: self.pos
                size: self.size

        BoxLayout:
            orientation: "vertical"
            size_hint_y: None
            height: dp(140)
            padding: dp(16)
            spacing: dp(8)
            canvas.before:
                Color:
                    rgba: 0.16, 0.35, 0.67, 1
                RoundedRectangle:
                    pos: self.pos
                    size: self.size
                    radius: [0, 0, 18, 18]

            Label:
                text: "MediTrack Clinic"
                font_size: "28sp"
                bold: True
                color: 1, 1, 1, 1
                halign: "left"
                valign: "middle"
                text_size: self.size

            Label:
                text: "Patient Records (SQL + Python)"
                font_size: "15sp"
                color: 0.85, 0.92, 1, 1
                halign: "left"
                valign: "middle"
                text_size: self.size

        BoxLayout:
            size_hint_y: None
            height: dp(68)
            padding: dp(12), dp(8)

            TextInput:
                id: search_input
                hint_text: "Search by name, gender, or symptom..."
                multiline: False
                padding: [dp(14), dp(14), dp(14), dp(14)]
                font_size: "16sp"
                background_normal: ""
                background_active: ""
                background_color: 1, 1, 1, 1
                foreground_color: 0.1, 0.1, 0.1, 1
                cursor_color: 0.16, 0.35, 0.67, 1
                on_text: root.refresh_patient_list(self.text)

        ScrollView:
            do_scroll_x: False
            bar_width: dp(6)
            GridLayout:
                id: patient_list
                cols: 1
                size_hint_y: None
                height: self.minimum_height
                spacing: dp(10)
                padding: dp(12), dp(4), dp(12), dp(16)

<PatientDetailScreen>:
    name: "detail"
    BoxLayout:
        orientation: "vertical"
        canvas.before:
            Color:
                rgba: 0.95, 0.97, 1, 1
            Rectangle:
                pos: self.pos
                size: self.size

        BoxLayout:
            size_hint_y: None
            height: dp(70)
            padding: dp(12)
            spacing: dp(8)
            canvas.before:
                Color:
                    rgba: 0.16, 0.35, 0.67, 1
                Rectangle:
                    pos: self.pos
                    size: self.size

            Button:
                text: "< Back"
                size_hint_x: None
                width: dp(90)
                on_release: root.go_back()
                background_normal: ""
                background_color: 0.08, 0.24, 0.5, 1
                color: 1, 1, 1, 1

            Label:
                text: "Patient Details"
                bold: True
                color: 1, 1, 1, 1
                font_size: "22sp"
                halign: "left"
                valign: "middle"
                text_size: self.size

        ScrollView:
            do_scroll_x: False
            BoxLayout:
                orientation: "vertical"
                size_hint_y: None
                height: self.minimum_height
                padding: dp(12)
                spacing: dp(12)

                SectionCard:
                    height: dp(100)
                    TitleText:
                        id: patient_name
                        text: "Name"
                        font_size: "26sp"
                    Label:
                        id: patient_demographics
                        text: "Age / Gender"
                        color: 0.3, 0.37, 0.48, 1
                        font_size: "16sp"
                        halign: "left"
                        valign: "middle"
                        text_size: self.size

                SectionCard:
                    height: dp(300)
                    TitleText:
                        text: "Medical Summary"
                        font_size: "20sp"
                    Label:
                        id: patient_full_details
                        text: "-"
                        color: 0.14, 0.2, 0.3, 1
                        font_size: "16sp"
                        halign: "left"
                        valign: "top"
                        text_size: self.width - dp(8), self.height
"""


class PatientListScreen(Screen):
    def on_pre_enter(self, *args) -> None:
        self.refresh_patient_list(self.ids.search_input.text if "search_input" in self.ids else "")

    def refresh_patient_list(self, query: str) -> None:
        patient_list = self.ids.patient_list
        patient_list.clear_widgets()

        app = App.get_running_app()
        patients = app.database.get_patients(query)

        if not patients:
            empty_state = Button(
                text="No patients found for this search.",
                size_hint_y=None,
                height=dp(64),
                background_normal="",
                background_color=(1, 1, 1, 1),
                color=(0.4, 0.46, 0.56, 1),
            )
            patient_list.add_widget(empty_state)
            return

        for patient in patients:
            line_1 = f"[b]{patient['full_name']}[/b]   ({patient['age']}, {patient['gender']})"
            line_2 = f"Last visit: {patient['last_visit']}"
            button = Button(
                text=f"{line_1}\n{line_2}",
                markup=True,
                size_hint_y=None,
                height=dp(94),
                background_normal="",
                background_color=(1, 1, 1, 1),
                color=(0.1, 0.17, 0.28, 1),
                halign="left",
                valign="middle",
                font_size="16sp",
                padding=(dp(16), dp(10)),
            )
            button.bind(size=lambda instance, value: setattr(instance, "text_size", (value[0] - dp(20), None)))
            button.bind(on_release=partial(self.open_patient_detail, patient["id"]))
            patient_list.add_widget(button)

    def open_patient_detail(self, patient_id: int, _button_instance: Button) -> None:
        detail_screen = self.manager.get_screen("detail")
        detail_screen.load_patient(patient_id)
        self.manager.current = "detail"


class PatientDetailScreen(Screen):
    def load_patient(self, patient_id: int) -> None:
        app = App.get_running_app()
        patient = app.database.get_patient_by_id(patient_id)
        if patient is None:
            return

        self.ids.patient_name.text = patient["full_name"]
        self.ids.patient_demographics.text = f"Age: {patient['age']}   |   Gender: {patient['gender']}"
        self.ids.patient_full_details.text = (
            f"Symptoms: {patient['symptoms']}\n"
            f"Medications: {patient['medications']}\n"
            f"Past treatments: {patient['treatments']}\n"
            f"Allergies: {patient['allergies']}\n"
            f"Phone: {patient['phone']}\n"
            f"Last visit: {patient['last_visit']}"
        )

    def go_back(self) -> None:
        self.manager.current = "list"


class MediTrackApp(App):
    def build(self) -> ScreenManager:
        Window.clearcolor = (0.95, 0.97, 1, 1)
        self.title = "MediTrack Clinic"
        self.database = ClinicDatabase()

        Builder.load_string(KV)
        screen_manager = ScreenManager()
        screen_manager.add_widget(PatientListScreen())
        screen_manager.add_widget(PatientDetailScreen())
        return screen_manager


if __name__ == "__main__":
    MediTrackApp().run()
