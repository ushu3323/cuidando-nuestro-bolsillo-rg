import { LoadingButton } from "@mui/lab";
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "../utils/api";

export default function AcceptTOSPage() {
  const session = useSession({required: true});
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const { isLoading: isSending, mutate: acceptTOS } =
    api.user.acceptTOS.useMutation();

  useEffect(() => {
    if (session.status === "authenticated") {
      if (!session.data.user.TOSAccepted) {
        setReady(true);
      } else {
        void router.replace("/") 
      }
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status]);

  useEffect(() => {
    if (ready) {
      setOpen(true);
    }
  }, [ready]);

  const handleSend = () => {
    if (accepted) {
      acceptTOS(undefined, {
        onError(error) {
          console.error(error);
        },
        onSuccess() {
          session
            .update()
            .then(() => router.push("/"))
            .catch((err) => console.error(err));
        },
      });
    }
  };

  return (
    <main>
      <Dialog open={open}>
        <DialogTitle>Terminos y Condiciones de Uso</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <h2 className="mb-8 mt-0 text-base">
              Ultima actualización: 25/02/2024
            </h2>

            <p className="mb-10 text-justify">
              Bienvenido a &quot;Precios RG&quot;, una plataforma donde los
              usuarios pueden registrar y compartir información sobre precios de
              productos en distintos comercios. Antes de poder utilizar nuestra
              aplicación, primero lea detenidamente estos términos y
              condiciones.
            </p>

            <h3>1. Aceptación de los Términos y Condiciones</h3>
            <p className="mb-8 text-justify">
              Al acceder y utilizar &quot;Precios RG&quot;, aceptas cumplir con
              estos términos y condiciones, así como con todas las leyes y
              regulaciones aplicables en Argentina. Si no estás de acuerdo con
              alguno de estos términos, por favor abstente de utilizar nuestra
              aplicación.
            </p>

            <h3>2. Registro y Cuenta de Usuario</h3>
            <p className="mb-8 text-justify">
              Para utilizar ciertas funciones de la aplicación, puede que
              necesites registrarte y crear una cuenta de usuario. Al
              registrarte, aceptas proporcionar información precisa, actualizada
              y completa sobre ti mismo, según lo solicitado en el formulario de
              registro. Eres responsable de mantener la confidencialidad de tu
              cuenta y contraseña, y de todas las actividades que ocurran bajo
              tu cuenta.
            </p>

            <h3>3. Responsabilidad del Usuario</h3>
            <p className="mb-8 text-justify">
              Tú eres el único responsable de la información que ingreses en la
              aplicación. Asegúrate de verificar la precisión y veracidad de los
              precios y demás información que compartas. &quot;Precios RG&quot;
              no se hace responsable por la veracidad de la información
              proporcionada por los usuarios.
            </p>

            <h3>4. Propiedad Intelectual</h3>
            <p className="mb-8 text-justify">
              Todos los derechos de propiedad intelectual sobre la aplicación y
              su contenido son propiedad de &quot;Precios RG&quot; o de sus
              licenciantes. Al compartir información en la aplicación, otorgas a
              nuestra empresa una licencia para usar, reproducir, modificar y
              distribuir dicha información de acuerdo con los propósitos de la
              aplicación.
            </p>

            <h3>4. Propiedad Intelectual</h3>
            <p className="mb-8 text-justify">
              Todos los derechos de propiedad intelectual sobre la aplicación y
              su contenido son propiedad de &quot;Precios RG&quot; o de sus
              licenciantes. Al compartir información en la aplicación, otorgas a
              nuestra empresa una licencia para usar, reproducir, modificar y
              distribuir dicha información de acuerdo con los propósitos de la
              aplicación.
            </p>

            <h3>5. Privacidad y Protección de Datos Personales</h3>
            <p className="mb-8 text-justify">
              Nos comprometemos a proteger la privacidad y seguridad de tus
              datos personales de acuerdo con la Ley de Protección de Datos
              Personales (Ley 25.326) y sus normativas complementarias. Al
              utilizar nuestra aplicación, aceptas el tratamiento de tus datos
              personales de acuerdo con nuestra Política de Privacidad.
            </p>

            <h3>6. Limitación de Responsabilidad</h3>
            <p className="mb-8 text-justify">
              En la medida máxima permitida por la ley, &quot;Precios RG&quot;
              no será responsable por daños directos, indirectos, incidentales,
              especiales, consecuentes o ejemplares, incluyendo, pero no
              limitado a, pérdida de beneficios, datos o uso, derivados del uso
              o la imposibilidad de usar la aplicación.
            </p>

            <h3>7. Ley Aplicable y Jurisdicción</h3>
            <p className="mb-8 text-justify">
              Estos términos y condiciones se regirán e interpretarán de acuerdo
              con las leyes de la República Argentina. Cualquier disputa
              relacionada con estos términos y condiciones estará sujeta a la
              jurisdicción exclusiva de los tribunales ordinarios de la Ciudad
              Autónoma de Buenos Aires.
            </p>

            <h3>8. Modificaciones de los Términos y Condiciones</h3>
            <p className="mb-8 text-justify">
              Nos reservamos el derecho de modificar estos términos y
              condiciones en cualquier momento sin previo aviso. Los cambios
              entrarán en vigencia en el momento de su publicación en la
              aplicación.
            </p>

            <p>
              Al utilizar &quot;Precios RG&quot;, aceptas estos términos y
              condiciones en su totalidad. Si tienes alguna pregunta o
              inquietud, por favor contáctanos a&nbsp;
              <a href="mailto:magianpc@gmail.com">magianpc@gmail.com</a>
            </p>
          </DialogContentText>
          <FormControlLabel
            required
            control={
              <Checkbox
                value={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
              />
            }
            label="Acepto los Terminos y Condiciones de Servicio"
          />
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loadingPosition="start"
            loading={isSending}
            onClick={handleSend}
            disabled={!accepted}
          >
            Enviar
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </main>
  );
}
